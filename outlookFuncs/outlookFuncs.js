import EWS from "node-ews";
import * as fs from "fs";


const ews = new EWS({
    username: process.env.OUTLOOK_USERNAME,
    password: process.env.OUTLOOK_PASSWORD,
    host: process.env.OUTLOOK_HOST
});

const formatMail = mailItem => {
    return ({
        id: mailItem.ItemId.attributes.Id,
        changeKey: mailItem.ItemId.attributes.ChangeKey,
        subject: mailItem.Subject,
        sentDate: mailItem.DateTimeCreated,
        senderName: mailItem.From.Mailbox.Name,
        senderEmail: mailItem.From.Mailbox.EmailAddress,
    })
}


export async function findLastMessages(offset) {
    const messIds = []
    const messages = []

    const ewsArgs = {
        "attributes" : {
            'Traversal': 'Shallow'
        },
        'ItemShape': {
            'BaseShape': 'AllProperties'
        },
        'IndexedPageItemView': {
            'attributes': {
                'MaxEntriesReturned': process.env.OUTLOOK_NUMBER_OF_MAILS,
                'Offset': offset,
                'BasePoint': 'Beginning'
            }
        },
        'ParentFolderIds': {
            'DistinguishedFolderId': {
                'attributes': {
                    'Id': 'inbox'
                }
            }
        }
    };

    try {
        const res = await ews.run('FindItem', ewsArgs)
        res.ResponseMessages.FindItemResponseMessage.RootFolder.Items.Message.forEach(item => {
            const ids = {
                id: item.ItemId.attributes.Id,
                changeKey: item.ItemId.attributes.ChangeKey,
            }
            messIds.push(ids)
        })


        for (const item of messIds) {
            const ewsArgsForIds = {
                'ItemShape': {
                    'BaseShape': 'Default',
                },
                'ItemIds': {
                    'ItemId': {
                        'attributes': {
                            'Id': `${item.id}`,
                            'ChangeKey': `${item.changeKey}`
                        }
                    },

                },

            };

            const res = await ews.run('GetItem', ewsArgsForIds)
            messages.push(formatMail(res.ResponseMessages.GetItemResponseMessage.Items.Message))
        }
        return messages

    } catch (err) {
        console.log(err.message)
        return err
    }
}


export async function sendEmail(subject, body, address, filenames) {

    // Функция преобразования файла в строку base64
    const encodeBase64 = (file) => {
        const bitmap = fs.readFileSync(file)
        return Buffer.from(bitmap).toString('base64')
    }


    // Формирование массива файлов для отправки
    let files = []
    if (filenames.length > 0) {
        filenames.forEach(name => {
            files.push({
                "Name": `${name.match('[^\\/]+$')}`,
                'IsInline': 'false',
                'IsContactPhoto': 'false',
                'Content': encodeBase64(`${process.env.ACT_BASE_PATH}${name}`)
            })
        })
    }


    const ewsFunction = 'CreateItem';
    const ewsHeaders = {
        't:RequestServerVersion': {
            'attributes': {
                'Version': 'Exchange2010_SP2'
            }
        }
    }

// define ews api function args
    let ewsArgs = {
        "attributes" : {
            "MessageDisposition" : "SendAndSaveCopy"
        },
        "SavedItemFolderId": {
            "DistinguishedFolderId": {
                "attributes": {
                    "Id": "sentitems"
                }
            }
        },
        "Items" : {
            "Message" : {
                'ItemClass': 'IPM.Note',
                "Subject" : `${subject}`,
                "Body" : {
                    "attributes": {
                        "BodyType" : "HTML"
                    },
                    "$value": `${body}`
                },
                "ToRecipients" : {
                    "Mailbox" : {
                        "EmailAddress" : `${address}`
                    }
                },
                "IsRead": "false"
            }
        }
    }

    if (filenames.length > 0) {
        ewsArgs = {
            "attributes" : {
                "MessageDisposition" : "SendAndSaveCopy"
            },
            "SavedItemFolderId": {
                "DistinguishedFolderId": {
                    "attributes": {
                        "Id": "sentitems"
                    }
                }
            },
            "Items" : {
                "Message" : {
                    'ItemClass': 'IPM.Note',
                    "Subject" : `${subject}`,
                    "Body" : {
                        "attributes": {
                            "BodyType" : "HTML"
                        },
                        "$value": `${body}`
                    },
                    "Attachments": {
                        "FileAttachment": files
                    },
                    "ToRecipients" : {
                        "Mailbox" : {
                            "EmailAddress" : `${address}`
                        }
                    },
                    "IsRead": "false"
                }
            }
        }
    }


// query ews, print resulting JSON to console

    return  await ews.run(ewsFunction, ewsArgs, ewsHeaders)
}

