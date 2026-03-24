"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const block_basekit_server_api_1 = require("@lark-opdev/block-basekit-server-api");
const crypto_js_1 = __importDefault(require("crypto-js"));
const { t } = block_basekit_server_api_1.field;
const domainList = [
    'feishu.cn',
    'feishucdn.com',
    'larksuitecdn.com',
    'larksuite.com',
    'tos-cn-beijing.volces.com',
    'cn-shanghai.oss.aliyuncs.com',
    'oss-cn-shanghai.aliyuncs.com',
];
block_basekit_server_api_1.basekit.addDomainList(domainList);
const TOS_DEFAULT = {
    accessKeyId: '',
    accessKeySecret: '',
    bucket: '',
    region: '',
};
const OSS_DEFAULT = {
    accessKeyId: '',
    accessKeySecret: '',
    bucket: '',
    region: '',
};
block_basekit_server_api_1.basekit.addField({
    i18n: {
        messages: {
            'zh-CN': {
                'storageType': '存储类型',
                'storageTypePlaceholder': '请选择存储类型',
                'tos': '火山引擎 TOS',
                'oss': '阿里云 OSS',
                'attachment': '附件字段',
                'attachmentPlaceholder': '请选择附件字段',
                'attachmentHelp': '首次使用请先查看',
                'attachmentHelpLink': ' 使用教程',
                'attachmentHelpMiddle': '，如有疑问请联系',
                'attachmentHelpGary': ' Gary',
                'fileName': '文件命名',
                'fileNamePlaceholder': '非必填，留空则使用原文件名，命名时无需填写文件后缀（如.jpg）',
                'fileNameTooltip': '支持点击小加号引用单元格的内容作为文件名（选择单元格所在列）。支持变量: {name}原文件名, {date}日期。',
                'appendTimestamp': '文件命名是否加上时间戳',
                'appendTimestampTooltip': '例如：FBIF邀请函_20260202143048.jpg 其中20260202143048 为时间戳。如果不加的话，则显示为：FBIF邀请函.jpg',
                'yes': '是',
                'no': '否',
                'storageTypeTooltip': '非必填，默认为阿里云OSS',
                'accessKeyId': 'AccessKeyId',
                'accessKeyIdPlaceholder': '非必填，留空使用默认配置',
                'accessKeySecret': 'AccessKeySecret',
                'accessKeySecretPlaceholder': '非必填，留空使用默认配置',
                'bucket': 'Bucket',
                'bucketPlaceholder': '非必填，留空使用默认配置',
                'region': 'Region',
                'regionPlaceholder': '非必填，留空使用默认配置',
            },
            'en-US': {
                'storageType': 'Storage Type',
                'storageTypePlaceholder': 'Select storage type',
                'storageTypeTooltip': 'Optional, default is Aliyun OSS',
                'tos': 'Volcengine TOS',
                'oss': 'Aliyun OSS',
                'attachment': 'Attachment Field',
                'attachmentPlaceholder': 'Select attachment field',
                'attachmentHelp': 'First time user please check',
                'attachmentHelpLink': ' User Guide',
                'attachmentHelpMiddle': ', contact',
                'attachmentHelpGary': ' Gary',
                'attachmentHelpSuffix': ' for questions',
                'fileName': 'File Naming',
                'fileNamePlaceholder': 'Optional, leave empty to use original filename, no extension needed (e.g. .jpg)',
                'fileNameTooltip': 'Support clicking the plus icon to reference cell content as filename. Variables: {name}filename, {date}date.',
                'appendTimestamp': 'Append timestamp to filename',
                'appendTimestampTooltip': 'Example: FBIF_20260202143048.jpg. If unchecked: FBIF.jpg',
                'yes': 'Yes',
                'no': 'No',
                'accessKeyId': 'AccessKeyId',
                'accessKeyIdPlaceholder': 'Optional, leave empty for default',
                'accessKeySecret': 'AccessKeySecret',
                'accessKeySecretPlaceholder': 'Optional, leave empty for default',
                'bucket': 'Bucket',
                'bucketPlaceholder': 'Optional, leave empty for default',
                'region': 'Region',
                'regionPlaceholder': 'Optional, leave empty for default',
            },
        }
    },
    formItems: [
        {
            key: 'attachment',
            label: t('attachment'),
            component: block_basekit_server_api_1.FieldComponent.FieldSelect,
            props: {
                placeholder: t('attachmentPlaceholder'),
                supportType: [block_basekit_server_api_1.FieldType.Attachment],
            },
            tooltips: [
                {
                    type: 'text',
                    content: t('attachmentHelp'),
                },
                {
                    type: 'link',
                    text: t('attachmentHelpLink'),
                    link: 'https://foodtalks.feishu.cn/docx/I7nYdmNVXokVuCxnSZ9cI4plnxI?from=from_copylink',
                },
                {
                    type: 'text',
                    content: t('attachmentHelpMiddle'),
                },
                {
                    type: 'link',
                    text: t('attachmentHelpGary'),
                    link: 'https://www.feishu.cn/invitation/page/add_contact/?token=436ra648-5cb0-4caa-851f-abfaed74ec76&amp;unique_id=avd4anR22EWnuNkUtKfKjQ==',
                },
            ],
            validator: {
                required: true,
            },
        },
        {
            key: 'fileName',
            label: t('fileName'),
            component: block_basekit_server_api_1.FieldComponent.Input,
            props: {
                placeholder: t('fileNamePlaceholder'),
            },
            tooltips: [
                {
                    type: 'text',
                    content: t('fileNameTooltip'),
                },
            ],
        },
        {
            key: 'appendTimestamp',
            label: t('appendTimestamp'),
            component: block_basekit_server_api_1.FieldComponent.Radio,
            tooltips: [
                {
                    type: 'text',
                    content: t('appendTimestampTooltip'),
                },
            ],
            props: {
                options: [
                    { label: t('yes'), value: 'yes' },
                    { label: t('no'), value: 'no' },
                ],
                defaultValue: 'yes',
            },
        },
        {
            key: 'storageType',
            label: t('storageType'),
            component: block_basekit_server_api_1.FieldComponent.SingleSelect,
            tooltips: [
                {
                    type: 'text',
                    content: t('storageTypeTooltip'),
                },
            ],
            props: {
                placeholder: t('storageTypePlaceholder'),
                options: [
                    { label: t('oss'), value: 'oss' },
                    { label: t('tos'), value: 'tos' },
                ],
            },
        },
        {
            key: 'accessKeyId',
            label: t('accessKeyId'),
            component: block_basekit_server_api_1.FieldComponent.Input,
            props: {
                placeholder: t('accessKeyIdPlaceholder'),
            },
        },
        {
            key: 'accessKeySecret',
            label: t('accessKeySecret'),
            component: block_basekit_server_api_1.FieldComponent.Input,
            props: {
                placeholder: t('accessKeySecretPlaceholder'),
            },
        },
        {
            key: 'bucket',
            label: t('bucket'),
            component: block_basekit_server_api_1.FieldComponent.Input,
            props: {
                placeholder: t('bucketPlaceholder'),
            },
        },
        {
            key: 'region',
            label: t('region'),
            component: block_basekit_server_api_1.FieldComponent.Input,
            props: {
                placeholder: t('regionPlaceholder'),
            },
        },
    ],
    resultType: {
        type: block_basekit_server_api_1.FieldType.Text,
    },
    execute: async (formItemParams, context) => {
        const { storageType, attachment, fileName, appendTimestamp, accessKeyId, accessKeySecret, bucket, region } = formItemParams;
        // Handle Radio component value structure (could be object or string depending on version)
        const appendTimestampValue = typeof appendTimestamp === 'object' ? appendTimestamp?.value : appendTimestamp;
        const shouldAppendTimestamp = appendTimestampValue !== 'no'; // Default to yes/true
        function debugLog(arg, showContext = false) {
            if (!showContext) {
                console.log(JSON.stringify({ arg, logID: context.logID }), '\n');
                return;
            }
            console.log(JSON.stringify({ formItemParams, context, arg }), '\n');
        }
        debugLog('=====start=====v2', true);
        const fetchWithLog = async (url, init) => {
            try {
                debugLog({ '===fetch start': { url, method: init?.method || 'GET' } });
                const res = await context.fetch(url, init);
                debugLog({ '===fetch done': { url, status: res.status } });
                return res;
            }
            catch (e) {
                debugLog({ '===fetch error': { url, error: e?.message || String(e) } });
                throw e;
            }
        };
        try {
            // 兼容处理：attachment 可能直接是数组，也可能是对象（取决于宿主环境）
            // 日志显示直接是数组，但也保留 .value 的检查以防万一
            const attachments = Array.isArray(attachment) ? attachment : (attachment?.value || []);
            if (attachments.length === 0) {
                return {
                    code: block_basekit_server_api_1.FieldCode.Success,
                    data: '无附件',
                };
            }
            const storageTypeValue = storageType?.value || 'oss';
            const isTOS = storageTypeValue === 'tos';
            const defaults = isTOS ? TOS_DEFAULT : OSS_DEFAULT;
            const config = {
                accessKeyId: accessKeyId || defaults.accessKeyId,
                accessKeySecret: accessKeySecret || defaults.accessKeySecret,
                bucket: bucket || defaults.bucket,
                region: region || defaults.region,
            };
            debugLog({ '===config': { storageType: storageTypeValue, bucket: config.bucket, region: config.region } });
            const now = new Date();
            const dateStr = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}`;
            // Generate a random batch ID with mixed case letters, numbers to prevent collisions
            // Using Base64 encoding for mixed case, replacing non-url-safe chars
            const randomWord = crypto_js_1.default.lib.WordArray.random(16); // 16 bytes for enough entropy
            const randomStr = randomWord.toString(crypto_js_1.default.enc.Base64)
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, '');
            // Try to get IDs from context (casting to any as strict types might miss them)
            const ctx = context;
            const tableId = ctx.tableID || ctx.tableId || 'unknown_table';
            const timestampForBatch = Date.now();
            const batchId = `${tableId}_${randomStr}_${timestampForBatch}`;
            const pathPrefix = `fbif-attachment-to-url/${dateStr}/${batchId}`;
            const uploadedUrls = [];
            const usedNames = new Set();
            for (const file of attachments) {
                debugLog({ '===processing file': { name: file.name, size: file.size } });
                const response = await fetchWithLog(file.tmp_url);
                if (!response.ok) {
                    debugLog({ '===download failed': { name: file.name, status: response.status } });
                    continue;
                }
                const arrayBuffer = await response.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                const ext = file.name.includes('.') ? file.name.split('.').pop() || '' : '';
                const nameWithoutExt = file.name.includes('.') ? file.name.slice(0, file.name.lastIndexOf('.')) : file.name;
                const timestamp = Date.now();
                const dateForName = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
                let finalName;
                // Base name handling (without extension)
                let nameBase;
                if (fileName && fileName.trim()) {
                    // Replace variables but ignore extension related ones as per new requirement
                    nameBase = fileName
                        .replace(/\{name\}/g, nameWithoutExt)
                        .replace(/\{date\}/g, dateForName);
                    // Strip any extension if user accidentally included it
                    // This prevents double extensions like .jpg.png or .jpg.jpg
                    if (nameBase.includes('.')) {
                        const parts = nameBase.split('.');
                        // If the last part looks like an extension (1-5 chars), remove it
                        if (parts.length > 1 && parts[parts.length - 1].length <= 5) {
                            parts.pop();
                            nameBase = parts.join('.');
                        }
                    }
                }
                else {
                    nameBase = nameWithoutExt;
                }
                // Append timestamp if requested
                if (shouldAppendTimestamp) {
                    nameBase = `${nameBase}_${timestamp}`;
                }
                // Add extension back
                if (ext) {
                    // Check if user accidentally included extension in custom pattern
                    if (!nameBase.endsWith(`.${ext}`)) {
                        finalName = `${nameBase}.${ext}`;
                    }
                    else {
                        finalName = nameBase;
                    }
                }
                else {
                    finalName = nameBase;
                }
                let uniqueName = finalName;
                let counter = 1;
                while (usedNames.has(uniqueName)) {
                    const nameBase = finalName.includes('.') ? finalName.slice(0, finalName.lastIndexOf('.')) : finalName;
                    const nameExt = finalName.includes('.') ? finalName.slice(finalName.lastIndexOf('.')) : '';
                    uniqueName = `${nameBase}(${counter})${nameExt}`;
                    counter++;
                }
                usedNames.add(uniqueName);
                const objectKey = `${pathPrefix}/${uniqueName}`;
                debugLog({ '===uploading': { objectKey, size: buffer.length } });
                let cdnUrl;
                if (isTOS) {
                    cdnUrl = await uploadToTOS(config, objectKey, buffer, file.type, fetchWithLog, debugLog);
                }
                else {
                    cdnUrl = await uploadToOSS(config, objectKey, buffer, file.type, fetchWithLog, debugLog);
                }
                if (cdnUrl) {
                    uploadedUrls.push(cdnUrl);
                    debugLog({ '===upload success': { objectKey, cdnUrl } });
                }
            }
            if (uploadedUrls.length === 0) {
                return {
                    code: block_basekit_server_api_1.FieldCode.Success,
                    data: '上传失败',
                };
            }
            const resultUrl = uploadedUrls.join(', ');
            debugLog({ '===result': { urls: uploadedUrls, count: uploadedUrls.length } });
            return {
                code: block_basekit_server_api_1.FieldCode.Success,
                data: resultUrl,
            };
        }
        catch (e) {
            debugLog({ '===error': String(e) });
            return {
                code: block_basekit_server_api_1.FieldCode.Error,
            };
        }
    },
});
async function uploadToTOS(config, objectKey, buffer, contentType, fetchWithLog, debugLog) {
    const { accessKeyId, accessKeySecret, bucket, region } = config;
    // Region handling: tos-cn-beijing -> cn-beijing
    const signingRegion = region.startsWith('tos-') ? region.replace(/^tos-/, '') : region;
    // Use native TOS endpoint
    const host = `${bucket}.${region}.volces.com`;
    const encodedKey = objectKey.split('/').map(encodeURIComponent).join('/');
    const url = `https://${host}/${encodedKey}`;
    const now = new Date();
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, ''); // YYYYMMDDTHHMMSSZ
    const dateStamp = amzDate.substring(0, 8);
    // TOS V4 Signature Calculation
    // Docs: https://www.volcengine.com/docs/6349/101889
    const service = 'tos';
    const method = 'PUT';
    const canonicalUri = `/${encodedKey}`;
    const canonicalQueryString = '';
    const wordArray = crypto_js_1.default.lib.WordArray.create(buffer);
    const payloadHash = crypto_js_1.default.SHA256(wordArray).toString(crypto_js_1.default.enc.Hex);
    const canonicalHeaders = `content-type:${contentType}\n` +
        `host:${host}\n` +
        `x-tos-content-sha256:${payloadHash}\n` +
        `x-tos-date:${amzDate}\n`;
    const signedHeaders = 'content-type;host;x-tos-content-sha256;x-tos-date';
    const canonicalRequest = `${method}\n` +
        `${canonicalUri}\n` +
        `${canonicalQueryString}\n` +
        `${canonicalHeaders}\n` +
        `${signedHeaders}\n` +
        `${payloadHash}`;
    const algorithm = 'TOS4-HMAC-SHA256';
    const credentialScope = `${dateStamp}/${signingRegion}/${service}/request`;
    const stringToSign = `${algorithm}\n` +
        `${amzDate}\n` +
        `${credentialScope}\n` +
        crypto_js_1.default.SHA256(canonicalRequest).toString(crypto_js_1.default.enc.Hex);
    const kDate = crypto_js_1.default.HmacSHA256(dateStamp, accessKeySecret);
    const kRegion = crypto_js_1.default.HmacSHA256(signingRegion, kDate);
    const kService = crypto_js_1.default.HmacSHA256(service, kRegion);
    const kSigning = crypto_js_1.default.HmacSHA256("request", kService);
    const signature = crypto_js_1.default.HmacSHA256(stringToSign, kSigning).toString(crypto_js_1.default.enc.Hex);
    const authorization = `${algorithm} Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
    debugLog({ '===TOS upload V4': { url, contentType, size: buffer.length } });
    const response = await fetchWithLog(url, {
        method: 'PUT',
        headers: {
            'Host': host,
            'Content-Type': contentType,
            'x-tos-date': amzDate,
            'x-tos-content-sha256': payloadHash,
            'Authorization': authorization,
        },
        body: buffer,
    });
    if (response.ok || response.status === 200) {
        return url;
    }
    const errorText = await response.text();
    debugLog({ '===TOS upload failed': { status: response.status, error: errorText } });
    return '';
}
async function uploadToOSS(config, objectKey, buffer, contentType, fetchWithLog, debugLog) {
    const { accessKeyId, accessKeySecret, bucket, region } = config;
    const host = `${bucket}.oss-${region}.aliyuncs.com`;
    const url = `https://${host}/${objectKey}`;
    const date = new Date().toUTCString();
    const contentMd5 = '';
    const stringToSign = `PUT\n${contentMd5}\n${contentType}\n${date}\n/${bucket}/${objectKey}`;
    const signature = crypto_js_1.default.HmacSHA1(stringToSign, accessKeySecret).toString(crypto_js_1.default.enc.Base64);
    const authorization = `OSS ${accessKeyId}:${signature}`;
    debugLog({ '===OSS upload': { url, contentType, size: buffer.length } });
    const response = await fetchWithLog(url, {
        method: 'PUT',
        headers: {
            'Host': host,
            'Date': date,
            'Content-Type': contentType,
            'Authorization': authorization,
        },
        body: buffer,
    });
    if (response.ok || response.status === 200) {
        return `https://${host}/${objectKey.split('/').map(encodeURIComponent).join('/')}`;
    }
    const errorText = await response.text();
    debugLog({ '===OSS upload failed': { status: response.status, error: errorText } });
    return '';
}
exports.default = block_basekit_server_api_1.basekit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxtRkFBZ0k7QUFDaEksMERBQWlDO0FBRWpDLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxnQ0FBSyxDQUFDO0FBRXBCLE1BQU0sVUFBVSxHQUFHO0lBQ2pCLFdBQVc7SUFDWCxlQUFlO0lBQ2Ysa0JBQWtCO0lBQ2xCLGVBQWU7SUFDZiwyQkFBMkI7SUFDM0IsOEJBQThCO0lBQzlCLDhCQUE4QjtDQUMvQixDQUFDO0FBRUYsa0NBQU8sQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7QUFFbEMsTUFBTSxXQUFXLEdBQUc7SUFDbEIsV0FBVyxFQUFFLEVBQUU7SUFDZixlQUFlLEVBQUUsRUFBRTtJQUNuQixNQUFNLEVBQUUsRUFBRTtJQUNWLE1BQU0sRUFBRSxFQUFFO0NBQ1gsQ0FBQztBQUVGLE1BQU0sV0FBVyxHQUFHO0lBQ2xCLFdBQVcsRUFBRSxFQUFFO0lBQ2YsZUFBZSxFQUFFLEVBQUU7SUFDbkIsTUFBTSxFQUFFLEVBQUU7SUFDVixNQUFNLEVBQUUsRUFBRTtDQUNYLENBQUM7QUFFRixrQ0FBTyxDQUFDLFFBQVEsQ0FBQztJQUNmLElBQUksRUFBRTtRQUNKLFFBQVEsRUFBRTtZQUNSLE9BQU8sRUFBRTtnQkFDUCxhQUFhLEVBQUUsTUFBTTtnQkFDckIsd0JBQXdCLEVBQUUsU0FBUztnQkFDbkMsS0FBSyxFQUFFLFVBQVU7Z0JBQ2pCLEtBQUssRUFBRSxTQUFTO2dCQUNoQixZQUFZLEVBQUUsTUFBTTtnQkFDcEIsdUJBQXVCLEVBQUUsU0FBUztnQkFDbEMsZ0JBQWdCLEVBQUUsVUFBVTtnQkFDNUIsb0JBQW9CLEVBQUUsT0FBTztnQkFDN0Isc0JBQXNCLEVBQUUsVUFBVTtnQkFDbEMsb0JBQW9CLEVBQUUsT0FBTztnQkFDN0IsVUFBVSxFQUFFLE1BQU07Z0JBQ2xCLHFCQUFxQixFQUFF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