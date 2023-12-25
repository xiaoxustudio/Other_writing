/*
 Navicat MySQL Data Transfer

 Source Server         : test
 Source Server Type    : MySQL
 Source Server Version : 50726
 Source Host           : localhost:3306
 Source Schema         : goproject

 Target Server Type    : MySQL
 Target Server Version : 50726
 File Encoding         : 65001

 Date: 24/12/2023 00:15:47
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for go_product
-- ----------------------------
DROP TABLE IF EXISTS `go_product`;
CREATE TABLE `go_product`  (
  `p_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '商品 ID',
  `p_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '商品名称',
  `p_img1` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '商品图片1',
  `p_img2` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '商品图片2',
  `p_img3` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '商品图片3',
  `p_img4` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '商品图片4',
  `p_img5` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '商品图片5',
  `p_img6` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '商品图片6',
  `p_img7` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '商品图片7',
  `p_img8` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '商品图片8',
  `p_type` enum('ad-product-computer','ad-product-phone','ad-product-pad','ad-product-ear') CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '商品分类',
  `p_price1` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '商品价格1',
  `p_price2` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '商品价格2',
  `p_present` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '商品介绍',
  `p_stock` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '商品库存',
  `p_version1` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '商品版本1',
  `p_version2` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '商品版本2',
  `p_color` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '商品颜色1',
  `p_color2` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '商品颜色2',
  PRIMARY KEY (`p_id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 33 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of go_product
-- ----------------------------
INSERT INTO `go_product` VALUES (16, 'HUAWEIFreeBuds 3 无线耳机', 'HUAWEIFreeBuds_gray.jpg', 'HUAWEIFreeBuds_gray.jpg', 'HUAWEIFreeBuds_gray.jpg', 'HUAWEIFreeBuds_gray.jpg', 'HUAWEIFreeBuds_gray.jpg', 'HUAWEIFreeBuds_gray.jpg', 'HUAWEIFreeBuds_gray.jpg', 'HUAWEIFreeBuds_gray.jpg', 'ad-product-ear', '2000', '2100', '半开放式主动降噪，麒麟Al芯片，抗干扰，低时延，无线快充，佩戴稳固舒适，震撼低音，搭配Mate30系列体验更佳', '100', '动圈式', '圈铁混合', '陶瓷白', '碳晶黑');
INSERT INTO `go_product` VALUES (15, '小米蓝牙耳机青春版', 'mmi6_white.jpg', 'mmi6_white.jpg', 'mmi6_white.jpg', 'mmi6_white.jpg', 'mmi6_white.jpg', 'mmi6_white.jpg', 'mmi6_white.jpg', 'mmi6_white.jpg', 'ad-product-ear', '59', '108', '6.5克轻巧/蓝牙4.1高清通话音质/支持切歌、音量调节', '100', '标准', '豪华', '黑色', '白色');
INSERT INTO `go_product` VALUES (14, 'vivoTWSEarphone真无线蓝牙耳机', 'vivoTWSEarphone_blue.jpg', 'vivoTWSEarphone_blue.jpg', 'vivoTWSEarphone_blue.jpg', 'vivoTWSEarphone_blue.jpg', 'vivoTWSEarphone_blue.jpg', 'vivoTWSEarphone_blue.jpg', 'vivoTWSEarphone_blue.jpg', 'vivoTWSEarphone_blue.jpg', 'ad-product-ear', '999', '1200', '疾速体验l智慧连接l高清音质Ⅰ语音声控l无感佩戴(温馨提示:拆封包装后不支持无理由退货)', '100', '3.5mm', 'Type-c', '星际蓝', '皓月白');
INSERT INTO `go_product` VALUES (13, 'AirPodsPro', 'AirPodsPro_black.jpg', 'AirPodsPro_black.jpg', 'AirPodsPro_black.jpg', 'AirPodsPro_black.jpg', 'AirPodsPro_black.jpg', 'AirPodsPro_black.jpg', 'AirPodsPro_black.jpg', 'AirPodsPro_black.jpg', 'ad-product-ear', '1999', '2100', '主动降噪Ⅰ通透模式Ⅰ全新设计Ⅰ卓越音质', '100', 'IPX5', 'IPX6', '白色', '黑色');
INSERT INTO `go_product` VALUES (12, '小米平板48/ 10.1英寸', 'mi_black.png', 'mi_black.png', 'mi_black.png', 'mi_black.png', 'mi_black.png', 'mi_black.png', 'mi_black.png', 'mi_black.png', 'ad-product-pad', '1499', '1899', '大电量,超长续航/支持Al人脸识别/后置1300万，前置500万摄像头/金属机身，超窄边框/骁龙660八核处理器', '100', '10英寸LTE版 64GB', '10英寸LTE版', '黑色', '粉色');
INSERT INTO `go_product` VALUES (11, '华为平板 M6 10.8英寸麒麟980芯片', 'HUAWEIM510_golden.png', 'HUAWEIM510_golden.png', 'HUAWEIM510_golden.png', 'HUAWEIM510_golden.png', 'HUAWEIM510_golden.png', 'HUAWEIM510_golden.png', 'HUAWEIM510_golden.png', 'HUAWEIM510_golden.png', 'ad-product-pad', '2699', '3999', '2K高清屏应用分屏一屏两用哈曼卡顿调音四声道四扬声器', '100', '4GB+64GB', '6GB+256GB', '黑色', '白色');
INSERT INTO `go_product` VALUES (10, '华为平板M5青春版8.0英寸', 'HUAWEIM5_golden.png', 'HUAWEIM5_golden.png', 'HUAWEIM5_golden.png', 'HUAWEIM5_golden.png', 'HUAWEIM5_golden.png', 'HUAWEIM5_golden.png', 'HUAWEIM5_golden.png', 'HUAWEIM5_golden.png', 'ad-product-pad', '1899', '1599', '智能声控平板哈曼卡顿调音麒麟710芯片AI智慧语音控制一切好说、哈曼卡顿调音细腻鲜活、麒麟710芯片强大内芯、5100毫安大电池持久续航', '100', '4GB+128GB', '4GB+128GB', '白色', '黑色');
INSERT INTO `go_product` VALUES (9, '华为平板M6高能版8.4英寸', 'HUAWEIM6_blue.jpg', 'HUAWEIM6_blue.jpg', 'HUAWEIM6_blue.jpg', 'HUAWEIM6_blue.jpg', 'HUAWEIM6_blue.jpg', 'HUAWEIM6_blue.jpg', 'HUAWEIM6_blue.jpg', 'HUAWEIM6_blue.jpg', 'ad-product-pad', '2699', '2799', '麒麟980芯片2K超清画质哈曼卡顿调音液冷散热 GPUTurbo加速游戏体验', '100', '6GB+128GB WiFi', '6GB+128GB 全网通', '幻影蓝', '幻影红');
INSERT INTO `go_product` VALUES (8, '小米 CC9 Pro', 'xiaomicc9pro_black.jpg', 'xiaomicc9pro_black.jpg', 'xiaomicc9pro_black.jpg', 'xiaomicc9pro_black.jpg', 'xiaomicc9pro_black.jpg', 'xiaomicc9pro_black.jpg', 'xiaomicc9pro_black.jpg', 'xiaomicc9pro_black.jpg', 'ad-product-phone', '2799', '3099', '1亿像素主摄/全场景五摄像头/四闪光灯/3200万自拍/10倍混合光学变焦，50 倍数字变焦5260mAh电量/标配30W疾速快充', '100', '8GB+128GB', '8GB+128GB', '暗夜魅影', '魔法绿境');
INSERT INTO `go_product` VALUES (7, '小米9 Pro 5G', 'xiaomicc9pro5G_black.jpg', 'xiaomicc9pro5G_black.jpg', 'xiaomicc9pro5G_black.jpg', 'xiaomicc9pro5G_black.jpg', 'xiaomicc9pro5G_black.jpg', 'xiaomicc9pro5G_black.jpg', 'xiaomicc9pro5G_black.jpg', 'xiaomicc9pro5G_black.jpg', 'ad-product-phone', '3699', '4299', '5G双卡全网通超高速网络/骁龙855Plus旗舰处理器40W有线闪充＋30W无线闪充＋10W无线反充，4000mAh长续航/4800万全焦段三摄', '100', '8GB+128GB', '8GB+512GB', '钛银黑', '梦之白');
INSERT INTO `go_product` VALUES (6, 'HUAWEI P30 5G', 'huaweip30pro_black.jpg', 'huaweip30pro_black.jpg', 'huaweip30pro_black.jpg', 'huaweip30pro_black.jpg', 'huaweip30pro_black.jpg', 'huaweip30pro_black.jpg', 'huaweip30pro_black.jpg', 'huaweip30pro_black.jpg', 'ad-product-phone', '4988', '5488', '麒麟980超感光徕卡四摄屏内指纹双景录像华为P30Pro尊享金卡专属服务权益', '100', '8GB+128GB', '8GB+256GB', '亮黑色', '天空之境');
INSERT INTO `go_product` VALUES (5, 'HUAWEIMate30Pro 5G', 'huaweimate30pro5g_black.jpg', 'huaweimate30pro5g_black.jpg', 'huaweimate30pro5g_black.jpg', 'huaweimate30pro5g_black.jpg', 'huaweimate30pro5g_black.jpg', 'huaweimate30pro5g_black.jpg', 'huaweimate30pro5g_black.jpg', 'huaweimate30pro5g_black.jpg', 'ad-product-phone', '6999', '7899', '全网通8GB + 256GB鹿麟990 5G旗舰SoC芯片，支持双模SA/NSA ;超感光徕卡电影四摄;超曲面OLED 环幕屏;4OW', '100', '6GB+256GB', '8GB+512GB', '亮黑色', '翡冷翠');
INSERT INTO `go_product` VALUES (3, 'RedmiBook 14增强版', 'RedmiBook14.png', 'RedmiBook14.png', 'RedmiBook14.png', 'RedmiBook 14.png', 'RedmiBook 14.png', 'RedmiBook 14.png', 'RedmiBook 14.png', 'RedmiBook 14.png', 'ad-product-computer', '4199', '3999', '全新十代酷睿处理器MX250独显/14英寸超窄边框高清屏/小米手环极速解锁炫酷多彩任你挑选', '100', 'i5 8G 512G MX250', 'i5 8G 256G MX250', '深空灰', '月光银');
INSERT INTO `go_product` VALUES (4, '小米游戏本2019款', 'xiaomigamebok.jpg', 'xiaomigamebok.jpg', 'xiaomigamebok.jpg', 'xiaomigamebok.jpg', 'xiaomigamebok.jpg', 'xiaomigamebok.jpg', 'xiaomigamebok.jpg', 'xiaomigamebok.jpg', 'ad-product-computer', '8999', '8599', '九代酷睿标压处理器/144Hz刷新率/3＋2包围式热管/12V台机级别散热风扇/72%色域', '100', 'i7 16G 1T PCle', 'i7 16G 512GB PCle', '暗夜灰', '若雪粉');
INSERT INTO `go_product` VALUES (1, 'MacBookpro', 'MacBookPro.jpg', 'MacBookPro.jpg', 'MacBookPro.jpg', 'MacBookPro.jpg', 'MacBookPro.jpg', 'MacBookPro.jpg', 'MacBookPro.jpg', 'MacBookPro.jpg', 'ad-product-computer', '18999', '21935', 'Apple MacBook Air【教育优惠】13.3 8核M1芯片(7核图形处理器) 8G 256G SSD 银色 笔记本电脑 MGN93CH/A', '100', '13.3英寸M1芯片8+7核8G+256G', '13.3英寸M1芯片8+7核16G+2T', '深空黑色', '银色');
INSERT INTO `go_product` VALUES (2, 'MagicBookpro', 'MacBookPro.jpg', 'MacBookPro.jpg', 'MacBookPro.jpg', 'MacBookPro.jpg', 'MacBookPro.jpg', 'MacBookPro.jpg', 'MacBookPro.jpg', 'MacBookPro.jpg', 'ad-product-computer', '5499', '6199', '16.1英寸高清全面屏，100%色域值,窄边框轻薄机身,全新第八代酷睿处理器，高性能体验，14小时长续航', '100', 'i5 8GB 512GB独显', 'i5 8GB 512GB', '星空灰', '冰河银');
INSERT INTO `go_product` VALUES (17, 'DellXPS 15', 'dellxps15_gray_0.png', 'DellXPS15.jpg', 'DellXPS15.jpg', 'DellXPS15.jpg', 'DellXPS15.jpg', 'DellXPS15.jpg', 'DellXPS15.jpg', 'DellXPS15.jpg', 'ad-product-computer', '1999', '2299', '15.6英寸4K触控屏/i9八核处理器/32GB内存/1TB SSD/NVIDIA GeForce GTX 1650 Ti独立显卡', '100', 'i9 32GB 1TB GTX1650Ti', 'i7 16GB 512GB GTX1650Ti', '银色', '黑色');
INSERT INTO `go_product` VALUES (18, 'ASUS ROG Strix G15', 'asusrog_gray_1.png', 'ASUSROGStrixG15.jpg', 'ASUSROGStrixG15.jpg', 'ASUSROGStrixG15.jpg', 'ASUSROGStrixG15.jpg', 'ASUSROGStrixG15.jpg', 'ASUSROGStrixG15.jpg', 'ASUSROGStrixG15.jpg', 'ad-product-computer', '2599', '2999', '15.6英寸144Hz屏/AMD Ryzen 7 4800HS处理器/16GB内存/512GB PCIe SSD/NVIDIA GeForce GTX 1660 Ti独立显卡', '100', 'Ryzen7 16GB 512GB GTX1660Ti', 'Ryzen5 8GB 256GB GTX1660Ti', '黑色', '火红');
INSERT INTO `go_product` VALUES (19, 'Lenovo ThinkPad X1 Carbon', 'lenovothinkpad_gray_2.png', 'LenovoThinkPadX1Carbon.jpg', 'LenovoThinkPadX1Carbon.jpg', 'LenovoThinkPadX1Carbon.jpg', 'LenovoThinkPadX1Carbon.jpg', 'LenovoThinkPadX1Carbon.jpg', 'LenovoThinkPadX1Carbon.jpg', 'LenovoThinkPadX1Carbon.jpg', 'ad-product-computer', '1899', '2099', '14英寸2K触控屏/i7四核处理器/16GB内存/512GB PCIe SSD/Intel UHD Graphics', '100', 'i7 16GB 512GB UHD Graphics', 'i5 8GB 256GB UHD Graphics', '黑色', '银色');
INSERT INTO `go_product` VALUES (20, 'HP Spectre x360', 'hpspectre_gray_3.png', 'HPSpectrex360.jpg', 'HPSpectrex360.jpg', 'HPSpectrex360.jpg', 'HPSpectrex360.jpg', 'HPSpectrex360.jpg', 'HPSpectrex360.jpg', 'HPSpectrex360.jpg', 'ad-product-computer', '1799', '1999', '13.3英寸4K触控屏/i5四核处理器/8GB内存/256GB PCIe SSD/Intel Iris Xe图形', '100', 'i5 8GB 256GB Iris Xe', 'i7 16GB 512GB Iris Xe', '夜灰色', '星银色');
INSERT INTO `go_product` VALUES (21, 'Samsung Galaxy S21 Ultra', 'samsungs21_gray_0.png', 'SamsungGalaxyS21Ultra.jpg', 'SamsungGalaxyS21Ultra.jpg', 'SamsungGalaxyS21Ultra.jpg', 'SamsungGalaxyS21Ultra.jpg', 'SamsungGalaxyS21Ultra.jpg', 'SamsungGalaxyS21Ultra.jpg', 'SamsungGalaxyS21Ultra.jpg', 'ad-product-phone', '1199', '1299', '6.8英寸Dynamic AMOLED 2X屏/Exynos 2100处理器/12GB内存/256GB存储/108MP四摄像头/5000mAh电池', '100', '8GB+256GB', '12GB+512GB', '幽影黑', '太空银');
INSERT INTO `go_product` VALUES (22, 'Google Pixel 6', 'googlepixel_gray_1.png', 'GooglePixel6.jpg', 'GooglePixel6.jpg', 'GooglePixel6.jpg', 'GooglePixel6.jpg', 'GooglePixel6.jpg', 'GooglePixel6.jpg', 'GooglePixel6.jpg', 'ad-product-phone', '899', '999', '6.4英寸OLED屏/Snapdragon 888处理器/8GB内存/128GB存储/50MP主摄像头/4600mAh电池', '100', '6GB+128GB', '8GB+256GB', '太阳橙', '云雾灰');
INSERT INTO `go_product` VALUES (23, 'OnePlus 9 Pro', 'oneplus9_gray_2.png', 'OnePlus9Pro.jpg', 'OnePlus9Pro.jpg', 'OnePlus9Pro.jpg', 'OnePlus9Pro.jpg', 'OnePlus9Pro.jpg', 'OnePlus9Pro.jpg', 'OnePlus9Pro.jpg', 'ad-product-phone', '799', '899', '6.7英寸Fluid AMOLED屏/Snapdragon 888处理器/12GB内存/256GB存储/48MP主摄像头/4500mAh电池', '100', '6GB+128GB', '12GB+512GB', '森林绿', '星霜蓝');
INSERT INTO `go_product` VALUES (24, 'Xiaomi Mi 11', 'xiaomimi11_gray_3.png', 'XiaomiMi11.jpg', 'XiaomiMi11.jpg', 'XiaomiMi11.jpg', 'XiaomiMi11.jpg', 'XiaomiMi11.jpg', 'XiaomiMi11.jpg', 'XiaomiMi11.jpg', 'ad-product-phone', '699', '799', '6.81英寸AMOLED屏/Snapdragon 888处理器/8GB内存/128GB存储/108MP主摄像头/4600mAh电池', '100', '8GB+256GB', '12GB+512GB', '云白色', '黑色');
INSERT INTO `go_product` VALUES (25, 'Samsung Galaxy Tab S7', 'samsungtabs7_gray_0.png', 'SamsungGalaxyTabS7.jpg', 'SamsungGalaxyTabS7.jpg', 'SamsungGalaxyTabS7.jpg', 'SamsungGalaxyTabS7.jpg', 'SamsungGalaxyTabS7.jpg', 'SamsungGalaxyTabS7.jpg', 'SamsungGalaxyTabS7.jpg', 'ad-product-pad', '599', '699', '11英寸LTPS LCD屏/Snapdragon 865+处理器/6GB内存/128GB存储/8000mAh电池/S Pen支持', '100', '6GB+128GB WiFi', '8GB+256GB 5G', '奔月灰', '奔流蓝');
INSERT INTO `go_product` VALUES (26, 'Apple iPad Air (2020)', 'ipadair_gray_1.png', 'AppleiPadAir2020.jpg', 'AppleiPadAir2020.jpg', 'AppleiPadAir2020.jpg', 'AppleiPadAir2020.jpg', 'AppleiPadAir2020.jpg', 'AppleiPadAir2020.jpg', 'AppleiPadAir2020.jpg', 'ad-product-pad', '499', '549', '10.9英寸Liquid Retina屏/A14 Bionic芯片/4GB内存/256GB存储/Touch ID/支持第二代Apple Pencil', '100', '4GB+64GB WiFi', '4GB+256GB WiFi', '深空灰', '玫瑰金');
INSERT INTO `go_product` VALUES (27, 'Lenovo Tab P11 Pro', 'lenovotabp11_gray_2.png', 'LenovoTabP11Pro.jpg', 'LenovoTabP11Pro.jpg', 'LenovoTabP11Pro.jpg', 'LenovoTabP11Pro.jpg', 'LenovoTabP11Pro.jpg', 'LenovoTabP11Pro.jpg', 'LenovoTabP11Pro.jpg', 'ad-product-pad', '299', '349', '11.5英寸OLED屏/Snapdragon 730G处理器/4GB内存/128GB存储/8600mAh电池/双摄像头', '100', '4GB+64GB', '6GB+128GB', '星夜黑', '晨曦白');
INSERT INTO `go_product` VALUES (28, 'Microsoft Surface Pro 7', 'surfacepro_gray_3.png', 'MicrosoftSurfacePro7.jpg', 'MicrosoftSurfacePro7.jpg', 'MicrosoftSurfacePro7.jpg', 'MicrosoftSurfacePro7.jpg', 'MicrosoftSurfacePro7.jpg', 'MicrosoftSurfacePro7.jpg', 'MicrosoftSurfacePro7.jpg', 'ad-product-pad', '799', '899', '12.3英寸PixelSense屏/Intel Core i5处理器/8GB内存/128GB SSD/USB-C/Windows 10 Home', '100', 'i5 8GB 128GB', 'i7 16GB 256GB', '冰雪银', '石墨黑');
INSERT INTO `go_product` VALUES (29, 'Sony WH-1000XM4', 'sonywh1000xm4_gray_0.png', 'SonyWH1000XM4.jpg', 'SonyWH1000XM4.jpg', 'SonyWH1000XM4.jpg', 'SonyWH1000XM4.jpg', 'SonyWH1000XM4.jpg', 'SonyWH1000XM4.jpg', 'SonyWH1000XM4.jpg', 'ad-product-ear', '249', '299', '无线降噪耳机/30小时续航/触控操作/多设备连接/黑色', '100', '黑色', '银色', '蓝色', '金色');
INSERT INTO `go_product` VALUES (30, 'Beats Powerbeats Pro', 'beatspowerbeatspro_gray_1.png', 'BeatsPowerbeatsPro.jpg', 'BeatsPowerbeatsPro.jpg', 'BeatsPowerbeatsPro.jpg', 'BeatsPowerbeatsPro.jpg', 'BeatsPowerbeatsPro.jpg', 'BeatsPowerbeatsPro.jpg', 'BeatsPowerbeatsPro.jpg', 'ad-product-ear', '199', '249', '无线运动耳机/高性能耳机芯片/H1无线芯片/长达9小时续航/黑色', '100', '黑色', '粉色', '绿色', '蓝色');
INSERT INTO `go_product` VALUES (31, 'JBL Free X', 'jblfreex_gray_2.png', 'JBLFreeX.jpg', 'JBLFreeX.jpg', 'JBLFreeX.jpg', 'JBLFreeX.jpg', 'JBLFreeX.jpg', 'JBLFreeX.jpg', 'JBLFreeX.jpg', 'ad-product-ear', '89', '99', '真无线耳机/舒适入耳设计/4小时续航/充电盒提供20小时额外续航/白色', '100', '白色', '黑色', '红色', '蓝色');
INSERT INTO `go_product` VALUES (32, 'Anker Soundcore Liberty Air 2 Pro', 'ankersoundcore_gray_3.png', 'AnkerSoundcoreLibertyAir2Pro.jpg', 'AnkerSoundcoreLibertyAir2Pro.jpg', 'AnkerSoundcoreLibertyAir2Pro.jpg', 'AnkerSoundcoreLibertyAir2Pro.jpg', 'AnkerSoundcoreLibertyAir2Pro.jpg', 'AnkerSoundcoreLibertyAir2Pro.jpg', 'AnkerSoundcoreLibertyAir2Pro.jpg', 'ad-product-ear', '129', '149', '真无线降噪耳机/多模式降噪/7小时续航/充电盒提供26小时额外续航/白色', '100', '白色', '黑色', '蓝色', '绿色');

-- ----------------------------
-- Table structure for shopcart
-- ----------------------------
DROP TABLE IF EXISTS `shopcart`;
CREATE TABLE `shopcart`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `phone` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `p_id` int(11) NOT NULL,
  `num` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for token_list
-- ----------------------------
DROP TABLE IF EXISTS `token_list`;
CREATE TABLE `token_list`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `phone` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `token` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `key` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `s_key` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `expire` date NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 29 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;


-- ----------------------------
-- Table structure for user_info
-- ----------------------------
DROP TABLE IF EXISTS `user_info`;
CREATE TABLE `user_info`  (
  `u_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户ID，主键(自增)',
  `phone` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '用户电话',
  `nickname` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '用户名',
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '邮箱',
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '密码',
  `birthday` date NULL DEFAULT NULL COMMENT '用户生日',
  `sex` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '性别',
  `bankcard` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '银行卡号',
  `true_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '真实姓名',
  `balance` decimal(10, 2) NULL COMMENT '账户余额，默认为0.00',
  `register_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '注册时间，默认为当前时间戳',
  `head_img` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT 'img/user/member.jpg' COMMENT '用户头像，默认路径为img/user/member.jpg',
  `status` enum('冻结','正常') CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT '正常' COMMENT '账号状态，默认为正常，可选值为冻结和正常',
  PRIMARY KEY (`u_id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 10 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_info
-- ----------------------------
INSERT INTO `user_info` VALUES (9, '13111111111', 'xuranaasd', NULL, '123456', NULL, NULL, NULL, NULL, 664004.00, '2023-12-18 07:42:28', 'img/user/member.jpg', '正常');

SET FOREIGN_KEY_CHECKS = 1;
