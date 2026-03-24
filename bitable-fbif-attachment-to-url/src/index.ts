import { basekit, FieldType, field, FieldComponent, FieldCode, FieldComponentEnum } from '@lark-opdev/block-basekit-server-api';
import CryptoJS from 'crypto-js';

const { t } = field;

const domainList = [
  'feishu.cn',
  'feishucdn.com',
  'larksuitecdn.com',
  'larksuite.com',
  'tos-cn-beijing.volces.com',
  'cn-shanghai.oss.aliyuncs.com',
  'oss-cn-shanghai.aliyuncs.com',
];

basekit.addDomainList(domainList);

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

basekit.addField({
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
      component: FieldComponent.FieldSelect,
      props: {
        placeholder: t('attachmentPlaceholder'),
        supportType: [FieldType.Attachment],
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
      component: FieldComponent.Input,
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
      component: FieldComponent.Radio,
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
      component: FieldComponent.SingleSelect,
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
      component: FieldComponent.Input,
      props: {
        placeholder: t('accessKeyIdPlaceholder'),
      },
    },
    {
      key: 'accessKeySecret',
      label: t('accessKeySecret'),
      component: FieldComponent.Input,
      props: {
        placeholder: t('accessKeySecretPlaceholder'),
      },
    },
    {
      key: 'bucket',
      label: t('bucket'),
      component: FieldComponent.Input,
      props: {
        placeholder: t('bucketPlaceholder'),
      },
    },
    {
      key: 'region',
      label: t('region'),
      component: FieldComponent.Input,
      props: {
        placeholder: t('regionPlaceholder'),
      },
    },
  ],

  resultType: {
    type: FieldType.Text,
  },

  execute: async (formItemParams: {
            storageType: { value: string };
            attachment: Array<{ name: string; size: number; type: string; tmp_url: string }>;
            fileName?: string;
            appendTimestamp?: { value: string } | string;
            accessKeyId?: string;
            accessKeySecret?: string;
            bucket?: string;
            region?: string;
          }, context) => {
            const { storageType, attachment, fileName, appendTimestamp, accessKeyId, accessKeySecret, bucket, region } = formItemParams;
            
            // Handle Radio component value structure (could be object or string depending on version)
            const appendTimestampValue = typeof appendTimestamp === 'object' ? appendTimestamp?.value : appendTimestamp;
            const shouldAppendTimestamp = appendTimestampValue !== 'no'; // Default to yes/true
        
            function debugLog(arg: any, showContext = false) {
              if (!showContext) {
                console.log(JSON.stringify({ arg, logID: context.logID }), '\n');
                return;
              }
              console.log(JSON.stringify({ formItemParams, context, arg }), '\n');
            }
        
            debugLog('=====start=====v2', true);
        
            const fetchWithLog = async (url: string, init?: RequestInit): Promise<Response> => {
              try {
                debugLog({ '===fetch start': { url, method: init?.method || 'GET' } });
                const res = await context.fetch(url, init);
                debugLog({ '===fetch done': { url, status: res.status } });
                return res;
              } catch (e: any) {
                debugLog({ '===fetch error': { url, error: e?.message || String(e) } });
                throw e;
              }
            };
        
            try {
              // 兼容处理：attachment 可能直接是数组，也可能是对象（取决于宿主环境）
              // 日志显示直接是数组，但也保留 .value 的检查以防万一
              const attachments = Array.isArray(attachment) ? attachment : ((attachment as any)?.value || []);
              
              if (attachments.length === 0) {
                return {
                  code: FieldCode.Success,
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
      const randomWord = CryptoJS.lib.WordArray.random(16); // 16 bytes for enough entropy
      const randomStr = randomWord.toString(CryptoJS.enc.Base64)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
      
      // Try to get IDs from context (casting to any as strict types might miss them)
      const ctx = context as any;
      const tableId = ctx.tableID || ctx.tableId || 'unknown_table';
      const timestampForBatch = Date.now();
      
      const batchId = `${tableId}_${randomStr}_${timestampForBatch}`;
      const pathPrefix = `fbif-attachment-to-url/${dateStr}/${batchId}`;

      const uploadedUrls: string[] = [];
      const usedNames = new Set<string>();

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

        let finalName: string;
        
        // Base name handling (without extension)
        let nameBase: string;
        
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
        } else {
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
          } else {
            finalName = nameBase;
          }
        } else {
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

        let cdnUrl: string;
        if (isTOS) {
          cdnUrl = await uploadToTOS(config, objectKey, buffer, file.type, fetchWithLog, debugLog);
        } else {
          cdnUrl = await uploadToOSS(config, objectKey, buffer, file.type, fetchWithLog, debugLog);
        }

        if (cdnUrl) {
          uploadedUrls.push(cdnUrl);
          debugLog({ '===upload success': { objectKey, cdnUrl } });
        }
      }

      if (uploadedUrls.length === 0) {
        return {
          code: FieldCode.Success,
          data: '上传失败',
        };
      }

      const resultUrl = uploadedUrls.join(', ');
      debugLog({ '===result': { urls: uploadedUrls, count: uploadedUrls.length } });

      return {
        code: FieldCode.Success,
        data: resultUrl,
      };

    } catch (e: any) {
      debugLog({ '===error': String(e) });
      return {
        code: FieldCode.Error,
      };
    }
  },
});

async function uploadToTOS(
  config: { accessKeyId: string; accessKeySecret: string; bucket: string; region: string },
  objectKey: string,
  buffer: Buffer,
  contentType: string,
  fetchWithLog: (url: string, init?: RequestInit) => Promise<Response>,
  debugLog: (arg: any) => void
): Promise<string> {
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
  
  const wordArray = CryptoJS.lib.WordArray.create(buffer as any);
  const payloadHash = CryptoJS.SHA256(wordArray).toString(CryptoJS.enc.Hex);
  
  const canonicalHeaders = 
    `content-type:${contentType}\n` +
    `host:${host}\n` +
    `x-tos-content-sha256:${payloadHash}\n` +
    `x-tos-date:${amzDate}\n`;
    
  const signedHeaders = 'content-type;host;x-tos-content-sha256;x-tos-date';
  
  const canonicalRequest = 
    `${method}\n` +
    `${canonicalUri}\n` +
    `${canonicalQueryString}\n` +
    `${canonicalHeaders}\n` +
    `${signedHeaders}\n` +
    `${payloadHash}`;

  const algorithm = 'TOS4-HMAC-SHA256';
  const credentialScope = `${dateStamp}/${signingRegion}/${service}/request`;
  const stringToSign = 
    `${algorithm}\n` +
    `${amzDate}\n` +
    `${credentialScope}\n` +
    CryptoJS.SHA256(canonicalRequest).toString(CryptoJS.enc.Hex);

  const kDate = CryptoJS.HmacSHA256(dateStamp, accessKeySecret);
  const kRegion = CryptoJS.HmacSHA256(signingRegion, kDate);
  const kService = CryptoJS.HmacSHA256(service, kRegion);
  const kSigning = CryptoJS.HmacSHA256("request", kService);
  
  const signature = CryptoJS.HmacSHA256(stringToSign, kSigning).toString(CryptoJS.enc.Hex);
  
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

async function uploadToOSS(
  config: { accessKeyId: string; accessKeySecret: string; bucket: string; region: string },
  objectKey: string,
  buffer: Buffer,
  contentType: string,
  fetchWithLog: (url: string, init?: RequestInit) => Promise<Response>,
  debugLog: (arg: any) => void
): Promise<string> {
  const { accessKeyId, accessKeySecret, bucket, region } = config;
  const host = `${bucket}.oss-${region}.aliyuncs.com`;
  const url = `https://${host}/${objectKey}`;

  const date = new Date().toUTCString();
  const contentMd5 = '';

  const stringToSign = `PUT\n${contentMd5}\n${contentType}\n${date}\n/${bucket}/${objectKey}`;
  const signature = CryptoJS.HmacSHA1(stringToSign, accessKeySecret).toString(CryptoJS.enc.Base64);
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

export default basekit;
