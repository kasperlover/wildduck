'use strict';

const log = require('npmlog');
const db = require('../db');
const util = require('util');

let run = async (taskData, options) => {
    const messageHandler = options.messageHandler;
    const deleteMessage = util.promisify(messageHandler.del.bind(messageHandler));

    const { user, mailbox, skipArchive } = taskData;

    let cursor = await db.database
        .collection('messages')
        .find({
            mailbox
        })
        .sort({ uid: -1 });

    let messageData;
    let deleted = 0;
    let errors = 0;

    while ((messageData = await cursor.next())) {
        if (!messageData || messageData.user.toString() !== user.toString()) {
            continue;
        }

        try {
            await deleteMessage({
                user,
                mailbox: { user, mailbox },
                messageData,
                archive: !messageData.flags.includes('\\Draft') && !skipArchive
            });
            deleted++;
        } catch (err) {
            errors++;
            log.error(
                'Tasks',
                'task=clear-folder id=%s user=%s mailbox=%s message=%s error=%s',
                taskData._id,
                taskData.user,
                taskData.mailbox,
                messageData._id,
                err.message
            );
        }
    }
    await cursor.close();

    try {
        // clear counters
        await db.redis.multi().del(`total:${mailbox}`).del(`unseen:${mailbox}`).exec();
    } catch (err) {
        // ignore
    }

    log.verbose('Tasks', 'task=clear-folder id=%s user=%s mailbox=%s deleted=%s errors=%s', taskData._id, taskData.user, taskData.mailbox, deleted, errors);
};

module.exports = (taskData, options, callback) => {
    run(taskData, options)
        .then(result => callback(null, result))
        .catch(err => {
            log.error('Tasks', 'task=clear-folder id=%s user=%s error=%s', taskData._id, taskData.user, err.message);
            callback(err);
        });
};
