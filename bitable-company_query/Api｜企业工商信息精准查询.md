1. 原文档地址
https://market.aliyun.com/detail/cmapi021276#sku=yuncode1527600000
1. 接口文档

1.1 接口信息
调用地址：https://searchcompany.apistore.cn/search
请求方式：GET
返回类型：JSON
API 调用：API 简单身份认证调用方法（APPCODE）API 签名认证调用方法（AppKey & AppSecret）

AppKey：204661549
AppSecret：CyuwnKZJHeDRjntsj4F4xszWx6gojDut
AppCode：f682ec4893d64a50a208cbcd3c03e01d

1.2 接口参数
- 请求参数（Header）
  无参数
- 请求参数（Query）
字段名称
必填
字段详情
companyName string
Y
完整的公司名称、注册号、信用代码实例值：深圳市腾讯计算机系统有限公司
- 请求参数（Body）
  无参数
2. 请求示例
        public static void main(String[] args) {
            String host = "https://searchcompany.apistore.cn";
            String path = "/search";
            String method = "GET";
            String appcode = "你自己的AppCode";
            Map<String, String> headers = new HashMap<String, String>();
            //最后在header中的格式(中间是英文空格)为Authorization:APPCODE 83359fd73fe94948385f570e3c139105
            headers.put("Authorization", "APPCODE " + appcode);
            Map<String, String> querys = new HashMap<String, String>();
            querys.put("companyName", "深圳市腾讯计算机系统有限公司");


            try {
                    /**
                    * 重要提示如下:
                    * HttpUtils请从
                    * https://github.com/aliyun/api-gateway-demo-sign-java/blob/master/src/main/java/com/aliyun/api/gateway/demo/util/HttpUtils.java
                    * 下载
                    *
                    * 相应的依赖请参照
                    * https://github.com/aliyun/api-gateway-demo-sign-java/blob/master/pom.xml
                    */
                    HttpResponse response = HttpUtils.doGet(host, path, method, headers, querys);
                    System.out.println(response.toString());
                    //获取response的body
                    //System.out.println(EntityUtils.toString(response.getEntity()));
            } catch (Exception e) {
                    e.printStackTrace();
            }
        }

3. 成功响应
{
  "error_code": 0,
  "reason": "查询成功",
  "result": {
    "companyName": "小米科技有限责任公司",
    "companyNameold": "北京小米科技有限责任公司",
    "companyNameEn": "",
    "creditCode": "91110108551385082Q",
    "companyCode": "551385082",
    "regNumber": "110108012660422",
    "taxNumber": "91110108551385082Q",
    "regType": "有限责任公司",
    "regOrgName": "北京市工商行政管理局海淀分局",
    "faRen": "雷军",
    "companyType": "法人",
    "businessStatus": "在业",
    "chkDate": "2018-06-20",
    "issueTime": "2010-03-03",
    "regDate": "2010-03-03",
    "bussiness": "2030-03-02",
    "cancelDate": "",
    "regMoney": "185000万人民币",
    "address": "北京市海淀区清河中街68号华润五彩城购物中心二期13层",
    "bussinessDes": "技术开发；货物进出口、技术进出口、代理进出口；销售通讯设备、厨房用品、卫生用品（含个人护理用品）、日用杂货、化妆品、医疗器械I类、II类、避孕器具、玩具、体育用品、文化用品、服装鞋帽、钟表眼镜、针纺织品、家用电器、家具（不从事实体店铺经营）、花、草及观赏植物、不再分装的包装种子、照相器材、工艺品、礼品...",
    "phone": "60606666-1000",
    "phonelist": "60606666-1000;60606666-1234;13501279672;",
    "email": "chenchongwei@xiaomi.com",
    "emaillist": "chenchongwei@xiaomi.com",
    "webSite": "www.mi.com",
    "webSitelist": "www.mi.com;www.xiaomi.com;xiaomi.com;www.mipush.com;www.facephoto.com;www.miui.com;www.miui.cn;www.xiaomi.cn;www.duokanbox.com;www.mitvos.net;www.mi.com;www.mi.cn;www.mifile.cn;58.220.58.153;58.220.59.2;58.220.58.152;www.miliao.com;www.miwifi.com;...",
    "province": "北京",
    "city": "北京市",
    "area": "海淀区",
    "industry": "科技推广和应用服务业"
  },
  "ordersign": "20190708160238292711015212"
}
4. 失败响应
{
  "error_code": 50002,
  "reason": "查询无结果",
  "ordersign": "20190708160238292711015212"
}

5. 接口说明
商品说明
根据企业名称、注册号、统一信用代码、组织机构代码获取企业工商基本信息，适用于公共网站、内部系统、移动APP用于工商信息展示，信息比对等功能，数据覆盖全国企业、个体工商户，按天更新
 
1)服务状态码
状态码	说明	是否收费	备注
0	查询成功	收费	-
50002	查询无结果	不收费	-
80099	交易失败,请稍候再试	不收费	-
5)返回参数
字段名称	类型	必填	字段说明	备注
error_code	int	Y	状态码	-
reason	string	Y	状态说明	-
ordersign	string	Y	订单号	-
----companyName	string	N	公司名称	-
----companyNameold	string	N	曾用名	-
----companyNameEn	string	N	公司名称-英文名	-
----creditCode	string	N	信用代码	-
----companyCode	string	N	组织机构代码	-
----regNumber	string	N	注册号	-
----regType	string	N	公司类型	-
----regOrgName	string	N	登记机关	-
----faRen	string	N	法人	-
----companyType	string	N	法人类型 取值公司、法人	-
----businessStatus	string	N	企业状态	-
----chkDate	string	N	核准日期	-
----issueTime	string	N	成立时间	-
----regDate	string	N	营业期限自	-
----bussiness	string	N	营业期限至	-
----cancelDate	string	N	注销日期	-
----regMoney	string	N	注册资金	-
----address	string	N	注册地址	-
----bussinessDes	string	N	经营范围	-
----phone	string	N	电话	-
----phonelist	string	N	电话列表	-
----email	string	N	邮箱	-
----emaillist	string	N	邮箱列表	-
----weiSite	string	N	网址	-
----weiSitelist	string	N	网址列表	-
----industry	string	N	所属行业	-
----province	string	N	省	-
----city	string	N	市	-
----area	string	N	区	-
 
 