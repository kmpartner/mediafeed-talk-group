import _ from 'lodash';
import { forTranslation } from './forTanslation';

// import { languages } from './config';
const { languages } = require('./config');

console.log(forTranslation);

const newArray = [];
for (const key in forTranslation) {

  const lanCode = forTranslation[key].CODE;
  // console.log(lanCode);
  // console.log(key, temp[key]);
  newArray.push(
    { 
      lCode: lanCode,
      data: { translation: forTranslation[key] }
    }
  )
}
console.log(newArray);

// console.log(_.keyBy(temp, 'CODE'));

// export const resources = 
//   _.chain(newArray)
//     .keyBy('lCode')
//     .mapValues('data')
//     .value();

// console.log(resources);


const lan2 = languages;

export const resources = Object.assign(
	{},
	...Object.keys(languages).map((index) => {
		return {
			[languages[index]]: {
				// translations: require('../locales/' + languages[index] + '/translation.json'),
				translation: require('./locales/' + languages[index] + '/common.json'),
        // translations: require('./locales/' + 'af' + '/common.json'),
			},
		};
	}),
);

console.log(resources);

// export const resources = {
//   en: {
//     translation: {
//       "LANGUAGE": "English",
//       "CODE": "en",
//       "test.text1": "Hello",
//       "test.text2": "Hi",
//       "test.text3": "Thank you",
//       "test.text4": "map",
//       "test.text5": "",
//       "": "",
//       "general.text1": "Cancel",
//       "general.text2": "Accept",
//       "general.text3": "Delete",
//       "general.text4": "Deleted",
//       "general.text5": "Edit",
//       "general.text6": "Update",
//       "general.text7": "Upload Image",
//       "general.text8": "Delete Image",
//       "general.text9": "Image",
//       "general.text10": "",
//       "general.text11": "",
//       "general.text12": "",
//       "general.text13": "",
//       "general.text14": "",
//       "general.text15": "",
//       "general.text16": "",
//       "__1": "",
//       "feed.text1": "New Post",
//       "feed.text2": "Show User Posts",
//       "feed.text3": "Show Posts",
//       "feed.text4": "view",
//       "feed.text5": "edit",
//       "feed.text6": "delete",
//       "feed.text7": "Is is no problem to delete post completely?",
//       "feed.text8": "Posted by",
//       "feed.text9": "Created by",
//       "feed.text10": "Title",
//       "feed.text11": "Image",
//       "feed.text12": "Content",
//       "feed.text13": "public",
//       "feed.text14": "private",
//       "feed.text15": "Title for post",
//       "feed.text16": "Content por post",
//       "feed.text17": "delete",
//       "feed.text18": "Is it no problem to delete image completely?",
//       "feed.text19": "Deleted",
//       "feed.text20": "",
//       "feed.text21": "",
//       "feed.text22": "",
//       "feed.text23": "",
//       "feed.text24": "",
//       "feed.text25": "",
//       "feed.text26": "",
//       "feed.text27": "",
//       "__2": "",
//       "userInfo.text1": "User Information",
//       "userInfo.text2": "name",
//       "userInfo.text3": "image",
//       "userInfo.text4": "creation date",
//       "userInfo.text5": "Is it no problem to delete image completely?",
//       "userInfo.text6": "New Name ...",
//       "userInfo.text7": "",
//       "userInfo.text8": "",
//       "userInfo.text9": "",
//       "userInfo.text10": "",
//       "userInfo.text11": "",
//       "userInfo.text12": "",
//       "userInfo.text13": "",
//       "userInfo.text14": "",

//       "auth.text1": "Your E-mail",
//       "auth.text2": "Your Name",
//       "auth.text3": "Password",
//       "auth.text4": "Password should be 8 - 20 characters, at least one uppercase letter, one lowercase letter, one number and one special character (@$!%*?&).",
//       "auth.text5": "Signup",
//       "auth.text6": "Login",
//       "auth.text7": "Forget Pasword",
//       "auth.text8": "Signup Page",
//       "auth.text9": "E-mail address for password reset",
//       "auth.text10": "send E-mail",

//       "nav.text1": "Feed",
//       "nav.text2": "Login",
//       "nav.text3": "Signup",
//       "nav.text4": "User Info",
//       "nav.text5": "Logout",
//       "nav.text6": "",

//       "notFound.text1": "Page Not Found",
//       "notFound.text2": "go to feed page",
//       "notFound.text3": "go to login page",

//       "comment.text1": "Cancel",
//       "comment.text2": "Delete",
//       "comment.text3": "Post Comment",
//       "comment.text4": "Show Reply",
//       "comment.text5": "total",
//       "comment.text6": "Write Reply",
//       "comment.text7": "Hide Reply",
//       "comment.text8": "Comments",
//       "comment.text9": "Is it no problem to delete this comment and replies of this comment completely?",
//       "comment.text10": "Is it no problem to delete this comment completely?",
//       "comment.text11": "",

//     }
//   },

//   zh: {
//     translation: {
//     "LANGUAGE": "Chinese",
//     "CODE": "zh",
//     "test.text1": "你好",
//     "test.text2": "你好",
//     "test.text3": "谢谢",
//     "test.text4": "地图",
//     "test.text5": "#VALUE!",
//     "": "#VALUE!",
//     "general.text1": "取消",
//     "general.text2": "接受",
//     "general.text3": "删除",
//     "general.text4": "已删除",
//     "general.text5": "编辑",
//     "general.text6": "更新",
//     "general.text7": "上传图片",
//     "general.text8": "删除图片",
//     "general.text9": "图片",
//     "general.text10": "饲料",
//     "general.text11": "登录",
//     "general.text12": "注册",
//     "general.text13": "用户信息",
//     "general.text14": "登出",
//     "general.text15": "#VALUE!",
//     "general.text16": "#VALUE!",
//     "__1": "#VALUE!",
//     "feed.text1": "最新帖子",
//     "feed.text2": "显示用户的帖子",
//     "feed.text3": "显示帖子",
//     "feed.text4": "视图",
//     "feed.text5": "编辑",
//     "feed.text6": "删除",
//     "feed.text7": "是否是删除后完全没问题？",
//     "feed.text8": "发布者",
//     "feed.text9": "由...制作",
//     "feed.text10": "标题",
//     "feed.text11": "图片",
//     "feed.text12": "内容",
//     "feed.text13": "上市",
//     "feed.text14": "私人的",
//     "feed.text15": "标题后",
//     "feed.text16": "内容POR后",
//     "feed.text17": "删除",
//     "feed.text18": "它是彻底删除图像没有问题？",
//     "feed.text19": "已删除",
//     "feed.text20": "",
//     "__2": "",
//     "userInfo.text1": "用户信息",
//     "userInfo.text2": "名称",
//     "userInfo.text3": "图片",
//     "userInfo.text4": "创立日期",
//     "userInfo.text5": "它是彻底删除图像没有问题？",
//     "userInfo.text6": "新名字 ...",
//     "userInfo.text7": "",
//     "__3": "",
//     "auth.text1": "你的邮件",
//     "auth.text2": "你的名字",
//     "auth.text3": "密码",
//     "auth.text4": "密码应为8  -  20个字符，至少一个大写字母，一个小写字母，一个数字和一个特殊字符（@ $％*！？）。",
//     "auth.text5": "注册",
//     "auth.text6": "登录",
//     "auth.text7": "忘记Pasword",
//     "auth.text8": "注册页面",
//     "auth.text9": "E-mail地址的密码重置",
//     "auth.text10": "发电子邮件",
//     "auth.text11": "",
//     "__4": "",
//     "nav.text1": "饲料",
//     "nav.text2": "登录",
//     "nav.text3": "注册",
//     "nav.text4": "用户信息",
//     "nav.text5": "登出",
//     "nav.text6": "#VALUE!",
//     "__5": "",
//     "notFound.text1": "网页未找到",
//     "notFound.text2": "去饲料页",
//     "notFound.text3": "进入登录页面",
//     "notFound.text4": "",
//     "notFound.text5": "",
//     "__6": "",
//     "comment.text1": "取消",
//     "comment.text2": "删除",
//     "comment.text3": "发表评论",
//     "comment.text4": "显示回复",
//     "comment.text5": "总",
//     "comment.text6": "写回复",
//     "comment.text7": "隐藏回复",
//     "comment.text8": "注释",
//     "comment.text9": "是否删除此评论完全的这一评论和答复没有问题？",
//     "comment.text10": "它是完全删除这条评论有没有问题？",
//     "comment.text11": ""
//     }
//   },

//   af: {
//     translation: {
//       "LANGUAGE": "Afrikaans",
//       "CODE": "af",
//       "test.text1": "hallo",
//       "test.text2": "Hi",
//       "test.text3": "Dankie",
//       "hello world": " af hello world from i18n !!!"
//     }
//   },
//   ar: {
//     translation: {
//       "LANGUAGE": "Arabic",
//       "CODE": "ar",
//       "test.text1": "مرحبا",
//       "test.text2": "مرحبا",
//       "test.text3": "شكرا لك",
//       "hello world": " ar hello world from i18n !!!"
//     }
//   },
//   az: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   be: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   bg: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   ca: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   cs: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   da: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   de: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   dv: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   el: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   // en: {
//   //   translation: {
//   //     "hello world": " zhCN hello world from i18n !!!"
//   //   }
//   // },
//   eo: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   es: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   et: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   eu: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   fa: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   zhCN: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   fi: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   fo: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   fr: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   gl: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   gu: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   he: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   hi: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   hr: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   hu: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   hy: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   id: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   is: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   it: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   ja: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   ka: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   kk: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   kn: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   ko: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   kok: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   ky: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   xx: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   lt: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   lv: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   mi: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   mk: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   mn: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   mr: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   ms: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   mt: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   nb: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   nl: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   ns: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   pa: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   pl: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   ps: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   pt: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   qu: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   ro: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   ru: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   sa: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   se: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   sk: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   sl: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   sq: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   sv: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   sw: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   syr: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   ta: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   te: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   th: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   tl: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   tn: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   tr: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   tt: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   ts: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   uk: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   ur: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   uz: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   vi: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   xh: {
//     translation: {
//       "LANGUAGE": "Xhosa",
//       "CODE": "xh",
//       "test.text1": "Mholo",
//       "test.text2": "Mholo",
//       "test.text3": "Enkosi",
//       "test.text4": "imephu",
//       "test.text5": "#VALUE!",
//       "": "#VALUE!",
//       "general.text1": "Rhoxisa",
//       "general.text2": "Yamkela",
//       "general.text3": "Cima",
//       "general.text4": "isusiwe",
//       "general.text5": "Hlela",
//       "general.text6": "Update",
//       "general.text7": "Layisha Image",
//       "general.text8": "Image Delete",
//       "general.text9": "image",
//       "general.text10": "Yondla",
//       "general.text11": "Ngema",
//       "general.text12": "Bhalisa",
//       "general.text13": "User Info",
//       "general.text14": "Phuma",
//       "general.text15": "#VALUE!",
//       "general.text16": "#VALUE!",
//       "__1": "#VALUE!",
//       "feed.text1": "New Post",
//       "feed.text2": "Bonisa Posts Umsebenzisi",
//       "feed.text3": "Bonisa Posts",
//       "feed.text4": "umbono",
//       "feed.text5": "hlela",
//       "feed.text6": "ususe",
//       "feed.text7": "Ngaba ayikho ingxaki sithuba Cima ngokupheleleyo?",
//       "feed.text8": "ithunyelwe ngu",
//       "feed.text9": "Yenziwe ngu",
//       "feed.text10": "isihloko",
//       "feed.text11": "image",
//       "feed.text12": "Content",
//       "feed.text13": "umphakathi",
//       "feed.text14": "labucala",
//       "feed.text15": "Isihloko for ngeposi",
//       "feed.text16": "post por Content",
//       "feed.text17": "ususe",
//       "feed.text18": "Ngaba akukho ngxaki kumfanekiso Cima ngokupheleleyo?",
//       "feed.text19": "isusiwe",
//       "feed.text20": "#VALUE!",
//       "__2": "#VALUE!",
//       "userInfo.text1": "Ulwazi lomsebenzisi",
//       "userInfo.text2": "igama",
//       "userInfo.text3": "umfanekiso",
//       "userInfo.text4": "usuku indalo",
//       "userInfo.text5": "Ngaba akukho ngxaki kumfanekiso Cima ngokupheleleyo?",
//       "userInfo.text6": "New Igama ...",
//       "userInfo.text7": "#VALUE!",
//       "__3": "#VALUE!",
//       "auth.text1": "Imeyile yakho",
//       "auth.text2": "Ingama lakho",
//       "auth.text3": "Inombolo yokuvula",
//       "auth.text4": "Password kufuneka 8 - 20 abalinganiswa, ubuncinane omnye unobumba, unobumba omnye negama, inombolo enye kunye nonobumba ezizodwa (@ $% * &!?).",
//       "auth.text5": "Bhalisa",
//       "auth.text6": "Ngema",
//       "auth.text7": "Libala Pasword",
//       "auth.text8": "Signup Page",
//       "auth.text9": "Idilesi ye-imeyile password ukuhlela",
//       "auth.text10": "ukuthumela E-mail",
//       "auth.text11": "#VALUE!",
//       "__4": "#VALUE!",
//       "nav.text1": "Yondla",
//       "nav.text2": "Ngema",
//       "nav.text3": "Bhalisa",
//       "nav.text4": "User Info",
//       "nav.text5": "Phuma",
//       "nav.text6": "#VALUE!",
//       "__5": "#VALUE!",
//       "notFound.text1": "Iphela alifumaneki",
//       "notFound.text2": "ukuya kwiphepha feed",
//       "notFound.text3": "ukuya kwiphepha lokungena",
//       "notFound.text4": "#VALUE!",
//       "notFound.text5": "#VALUE!",
//       "__6": "#VALUE!",
//       "comment.text1": "Rhoxisa",
//       "comment.text2": "Cima",
//       "comment.text3": "Post Comment",
//       "comment.text4": "Bonisa Phendula",
//       "comment.text5": "iyonke",
//       "comment.text6": "Bhala impendulo",
//       "comment.text7": "Fihla Phendula",
//       "comment.text8": "izimvo",
//       "comment.text9": "Ngaba akukho ngxaki ukucima le izimvo kunye nezimpendulo yale mazwana ngokupheleleyo?",
//       "comment.text10": "Ngaba akukho ngxaki ukucima le mazwana ngokupheleleyo?",
//       "comment.text11": "#VALUE!"
//     }
//   },
//   // zh: {
//   //   translation: {
//   //     "hello world": " zhCN hello world from i18n !!!"
//   //   }
//   // },
//   zhCN: {
//     translation: {
//       "LANGUAGE": "Chinese (S)",
//       "CODE": "zh-CN",
//       "test.text1": "你好",
//       "test.text2": "你好",
//       "test.text3": "谢谢",
//       "test.text4": "地图",
//       "test.text5": "#VALUE!",
//       "": "#VALUE!",
//       "general.text1": "取消",
//       "general.text2": "接受",
//       "general.text3": "删除",
//       "general.text4": "已删除",
//       "general.text5": "编辑",
//       "general.text6": "更新",
//       "general.text7": "上传图片",
//       "general.text8": "删除图片",
//       "general.text9": "图片",
//       "general.text10": "饲料",
//       "general.text11": "登录",
//       "general.text12": "注册",
//       "general.text13": "用户信息",
//       "general.text14": "登出",
//       "general.text15": "#VALUE!",
//       "general.text16": "#VALUE!",
//       "__1": "#VALUE!",
//       "feed.text1": "最新帖子",
//       "feed.text2": "显示用户的帖子",
//       "feed.text3": "显示帖子",
//       "feed.text4": "视图",
//       "feed.text5": "编辑",
//       "feed.text6": "删除",
//       "feed.text7": "是否是删除后完全没问题？",
//       "feed.text8": "发布者",
//       "feed.text9": "由...制作",
//       "feed.text10": "标题",
//       "feed.text11": "图片",
//       "feed.text12": "内容",
//       "feed.text13": "上市",
//       "feed.text14": "私人的",
//       "feed.text15": "标题后",
//       "feed.text16": "内容POR后",
//       "feed.text17": "删除",
//       "feed.text18": "它是彻底删除图像没有问题？",
//       "feed.text19": "已删除",
//       "feed.text20": "#VALUE!",
//       "__2": "#VALUE!",
//       "userInfo.text1": "用户信息",
//       "userInfo.text2": "名称",
//       "userInfo.text3": "图片",
//       "userInfo.text4": "创立日期",
//       "userInfo.text5": "它是彻底删除图像没有问题？",
//       "userInfo.text6": "新名字 ...",
//       "userInfo.text7": "#VALUE!",
//       "__3": "#VALUE!",
//       "auth.text1": "你的邮件",
//       "auth.text2": "你的名字",
//       "auth.text3": "密码",
//       "auth.text4": "密码应为8  -  20个字符，至少一个大写字母，一个小写字母，一个数字和一个特殊字符（@ $％*！？）。",
//       "auth.text5": "注册",
//       "auth.text6": "登录",
//       "auth.text7": "忘记Pasword",
//       "auth.text8": "注册页面",
//       "auth.text9": "E-mail地址的密码重置",
//       "auth.text10": "发电子邮件",
//       "auth.text11": "#VALUE!",
//       "__4": "#VALUE!",
//       "nav.text1": "饲料",
//       "nav.text2": "登录",
//       "nav.text3": "注册",
//       "nav.text4": "用户信息",
//       "nav.text5": "登出",
//       "nav.text6": "#VALUE!",
//       "__5": "#VALUE!",
//       "notFound.text1": "网页未找到",
//       "notFound.text2": "去饲料页",
//       "notFound.text3": "进入登录页面",
//       "notFound.text4": "#VALUE!",
//       "notFound.text5": "#VALUE!",
//       "__6": "#VALUE!",
//       "comment.text1": "取消",
//       "comment.text2": "删除",
//       "comment.text3": "发表评论",
//       "comment.text4": "显示回复",
//       "comment.text5": "总",
//       "comment.text6": "写回复",
//       "comment.text7": "隐藏回复",
//       "comment.text8": "注释",
//       "comment.text9": "是否删除此评论完全的这一评论和答复没有问题？",
//       "comment.text10": "它是完全删除这条评论有没有问题？",
//       "comment.text11": "#VALUE!"
//     }
//   },
//   zhHK: {
//     translation: {
//       "LANGUAGE": "Chinese (Hong Kong)",
//       "CODE": "zh-HK",
//       "test.text1": "你好",
//       "test.text2": "你好",
//       "test.text3": "謝謝",
//       "test.text4": "地圖",
//       "test.text5": "#VALUE!",
//       "": "#VALUE!",
//       "general.text1": "取消",
//       "general.text2": "接受",
//       "general.text3": "刪除",
//       "general.text4": "已刪除",
//       "general.text5": "編輯",
//       "general.text6": "更新",
//       "general.text7": "上傳圖片",
//       "general.text8": "刪除圖片",
//       "general.text9": "圖片",
//       "general.text10": "飼料",
//       "general.text11": "登錄",
//       "general.text12": "註冊",
//       "general.text13": "用戶信息",
//       "general.text14": "登出",
//       "general.text15": "#VALUE!",
//       "general.text16": "#VALUE!",
//       "__1": "#VALUE!",
//       "feed.text1": "最新帖子",
//       "feed.text2": "顯示用戶的帖子",
//       "feed.text3": "顯示帖子",
//       "feed.text4": "視圖",
//       "feed.text5": "編輯",
//       "feed.text6": "刪除",
//       "feed.text7": "是否是刪除後完全沒問題？",
//       "feed.text8": "發布者",
//       "feed.text9": "由...製作",
//       "feed.text10": "標題",
//       "feed.text11": "圖片",
//       "feed.text12": "內容",
//       "feed.text13": "上市",
//       "feed.text14": "私人的",
//       "feed.text15": "標題後",
//       "feed.text16": "內容POR後",
//       "feed.text17": "刪除",
//       "feed.text18": "它是徹底刪除圖像沒有問題？",
//       "feed.text19": "已刪除",
//       "feed.text20": "#VALUE!",
//       "__2": "#VALUE!",
//       "userInfo.text1": "用戶信息",
//       "userInfo.text2": "名稱",
//       "userInfo.text3": "圖片",
//       "userInfo.text4": "創立日期",
//       "userInfo.text5": "它是徹底刪除圖像沒有問題？",
//       "userInfo.text6": "新名字 ...",
//       "userInfo.text7": "#VALUE!",
//       "__3": "#VALUE!",
//       "auth.text1": "你的郵件",
//       "auth.text2": "你的名字",
//       "auth.text3": "密碼",
//       "auth.text4": "密碼應為8  -  20個字符，至少一個大寫字母，一個小寫字母，一個數字和一個特殊字符（@ $％*！？）。",
//       "auth.text5": "註冊",
//       "auth.text6": "登錄",
//       "auth.text7": "忘記Pasword",
//       "auth.text8": "註冊頁面",
//       "auth.text9": "E-mail地址的密碼重置",
//       "auth.text10": "發電子郵件",
//       "auth.text11": "#VALUE!",
//       "__4": "#VALUE!",
//       "nav.text1": "飼料",
//       "nav.text2": "登錄",
//       "nav.text3": "註冊",
//       "nav.text4": "用戶信息",
//       "nav.text5": "登出",
//       "nav.text6": "#VALUE!",
//       "__5": "#VALUE!",
//       "notFound.text1": "網頁未找到",
//       "notFound.text2": "去飼料頁",
//       "notFound.text3": "進入登錄頁面",
//       "notFound.text4": "#VALUE!",
//       "notFound.text5": "#VALUE!",
//       "__6": "#VALUE!",
//       "comment.text1": "取消",
//       "comment.text2": "刪除",
//       "comment.text3": "發表評論",
//       "comment.text4": "顯示回复",
//       "comment.text5": "總",
//       "comment.text6": "寫回复",
//       "comment.text7": "隱藏回复",
//       "comment.text8": "註釋",
//       "comment.text9": "是否刪除此評論完全的這一評論和答复沒有問題？",
//       "comment.text10": "它是完全刪除這條評論有沒有問題？",
//       "comment.text11": "#VALUE!"
//     }
//   },
//   zhTW: {
//     translation: {
//       "LANGUAGE": "Chinese (T)",
//       "CODE": "zh-TW",
//       "test.text1": "你好",
//       "test.text2": "你好",
//       "test.text3": "謝謝",
//       "test.text4": "地圖",
//       "test.text5": "#VALUE!",
//       "": "#VALUE!",
//       "general.text1": "取消",
//       "general.text2": "接受",
//       "general.text3": "刪除",
//       "general.text4": "已刪除",
//       "general.text5": "編輯",
//       "general.text6": "更新",
//       "general.text7": "上傳圖片",
//       "general.text8": "刪除圖片",
//       "general.text9": "圖片",
//       "general.text10": "飼料",
//       "general.text11": "登錄",
//       "general.text12": "註冊",
//       "general.text13": "用戶信息",
//       "general.text14": "登出",
//       "general.text15": "#VALUE!",
//       "general.text16": "#VALUE!",
//       "__1": "#VALUE!",
//       "feed.text1": "最新帖子",
//       "feed.text2": "顯示用戶的帖子",
//       "feed.text3": "顯示帖子",
//       "feed.text4": "視圖",
//       "feed.text5": "編輯",
//       "feed.text6": "刪除",
//       "feed.text7": "是否是刪除後完全沒問題？",
//       "feed.text8": "發布者",
//       "feed.text9": "由...製作",
//       "feed.text10": "標題",
//       "feed.text11": "圖片",
//       "feed.text12": "內容",
//       "feed.text13": "上市",
//       "feed.text14": "私人的",
//       "feed.text15": "標題後",
//       "feed.text16": "內容POR後",
//       "feed.text17": "刪除",
//       "feed.text18": "它是徹底刪除圖像沒有問題？",
//       "feed.text19": "已刪除",
//       "feed.text20": "#VALUE!",
//       "__2": "#VALUE!",
//       "userInfo.text1": "用戶信息",
//       "userInfo.text2": "名稱",
//       "userInfo.text3": "圖片",
//       "userInfo.text4": "創立日期",
//       "userInfo.text5": "它是徹底刪除圖像沒有問題？",
//       "userInfo.text6": "新名字 ...",
//       "userInfo.text7": "#VALUE!",
//       "__3": "#VALUE!",
//       "auth.text1": "你的郵件",
//       "auth.text2": "你的名字",
//       "auth.text3": "密碼",
//       "auth.text4": "密碼應為8  -  20個字符，至少一個大寫字母，一個小寫字母，一個數字和一個特殊字符（@ $％*！？）。",
//       "auth.text5": "註冊",
//       "auth.text6": "登錄",
//       "auth.text7": "忘記Pasword",
//       "auth.text8": "註冊頁面",
//       "auth.text9": "E-mail地址的密碼重置",
//       "auth.text10": "發電子郵件",
//       "auth.text11": "#VALUE!",
//       "__4": "#VALUE!",
//       "nav.text1": "飼料",
//       "nav.text2": "登錄",
//       "nav.text3": "註冊",
//       "nav.text4": "用戶信息",
//       "nav.text5": "登出",
//       "nav.text6": "#VALUE!",
//       "__5": "#VALUE!",
//       "notFound.text1": "網頁未找到",
//       "notFound.text2": "去飼料頁",
//       "notFound.text3": "進入登錄頁面",
//       "notFound.text4": "#VALUE!",
//       "notFound.text5": "#VALUE!",
//       "__6": "#VALUE!",
//       "comment.text1": "取消",
//       "comment.text2": "刪除",
//       "comment.text3": "發表評論",
//       "comment.text4": "顯示回复",
//       "comment.text5": "總",
//       "comment.text6": "寫回复",
//       "comment.text7": "隱藏回复",
//       "comment.text8": "註釋",
//       "comment.text9": "是否刪除此評論完全的這一評論和答复沒有問題？",
//       "comment.text10": "它是完全刪除這條評論有沒有問題？",
//       "comment.text11": "#VALUE!"
//     }
//   },
//   zu: {
//     translation: {
//       "LANGUAGE": "Zulu",
//       "CODE": "zu",
//       "test.text1": "Sawubona",
//       "test.text2": "Sawubona",
//       "test.text3": "Ngiyabonga",
//       "test.text4": "kumephu",
//       "test.text5": "#VALUE!",
//       "": "#VALUE!",
//       "general.text1": "Khansela",
//       "general.text2": "Yamukela",
//       "general.text3": "Susa",
//       "general.text4": "Isuse",
//       "general.text5": "Hlela",
//       "general.text6": "Buyekeza",
//       "general.text7": "Layisha Image",
//       "general.text8": "Susa Image",
//       "general.text9": "image",
//       "general.text10": "Okuphakelayo",
//       "general.text11": "Ngena ngemvume",
//       "general.text12": "Bhalisela",
//       "general.text13": "Info Umsebenzisi",
//       "general.text14": "Phuma",
//       "general.text15": "#VALUE!",
//       "general.text16": "#VALUE!",
//       "__1": "#VALUE!",
//       "feed.text1": "Iposi elisha",
//       "feed.text2": "Bonisa Umsebenzisi Okuthunyelwe",
//       "feed.text3": "Bonisa Okuthunyelwe",
//       "feed.text4": "umbono",
//       "feed.text5": "hlela",
//       "feed.text6": "ukususa",
//       "feed.text7": "Ingabe is akunankinga kuposi wokusula ngokuphelele?",
//       "feed.text8": "Kuthunyelwe ngu-",
//       "feed.text9": "Yakhiwe ngu-",
//       "feed.text10": "Isihloko",
//       "feed.text11": "image",
//       "feed.text12": "Okuqukethwe",
//       "feed.text13": "yomphakathi",
//       "feed.text14": "yangasese",
//       "feed.text15": "Isihloko okuthunyelwe",
//       "feed.text16": "iposi por sokuqukethwe",
//       "feed.text17": "ukususa",
//       "feed.text18": "Ingabe akukho nkinga isithombe wokusula ngokuphelele?",
//       "feed.text19": "Isuse",
//       "feed.text20": "#VALUE!",
//       "__2": "#VALUE!",
//       "userInfo.text1": "Imininingwane Umsebenzisi",
//       "userInfo.text2": "igama",
//       "userInfo.text3": "isithombe",
//       "userInfo.text4": "usuku lokwakha",
//       "userInfo.text5": "Ingabe akukho nkinga isithombe wokusula ngokuphelele?",
//       "userInfo.text6": "Igama elisha ...",
//       "userInfo.text7": "#VALUE!",
//       "__3": "#VALUE!",
//       "auth.text1": "Imeyili yakho",
//       "auth.text2": "Igama lakho",
//       "auth.text3": "Iphasiwedi",
//       "auth.text4": "Iphasiwedi kumele ibe 8 - 20 izinhlamvu, uhlamvu olulodwa usonhlamvukazi, incwadi eyodwa ezincane, inombolo eyodwa kanye ngohlamvu olulodwa ekhethekile (@ $% * &!?).",
//       "auth.text5": "Bhalisela",
//       "auth.text6": "Ngena ngemvume",
//       "auth.text7": "Khohlwa Pasword",
//       "auth.text8": "lokubhalisa Page",
//       "auth.text9": "Ikheli le-imeyili ukuze ukusetha kabusha iphasiwedi",
//       "auth.text10": "ukuthumela E-mail",
//       "auth.text11": "#VALUE!",
//       "__4": "#VALUE!",
//       "nav.text1": "Okuphakelayo",
//       "nav.text2": "Ngena ngemvume",
//       "nav.text3": "Bhalisela",
//       "nav.text4": "Info Umsebenzisi",
//       "nav.text5": "Phuma",
//       "nav.text6": "#VALUE!",
//       "__5": "#VALUE!",
//       "notFound.text1": "Ikhasi alitholakali",
//       "notFound.text2": "iya ekhasini okuphakelayo",
//       "notFound.text3": "iya ekhasini ngemvume",
//       "notFound.text4": "#VALUE!",
//       "notFound.text5": "#VALUE!",
//       "__6": "#VALUE!",
//       "comment.text1": "Khansela",
//       "comment.text2": "Susa",
//       "comment.text3": "Thumela amazwana",
//       "comment.text4": "Bonisa impendulo",
//       "comment.text5": "Imininingwane",
//       "comment.text6": "Bhala impendulo",
//       "comment.text7": "Fihla impendulo",
//       "comment.text8": "Amazwana",
//       "comment.text9": "Ingabe ayikho inkinga ukususa le amazwana kanye nezimpendulo mazwana ngokuphelele?",
//       "comment.text10": "Ingabe ayikho inkinga ukususa ngokuphelele mazwana?",
//       "comment.text11": "#VALUE!"
//     }
//   },
//   xxx: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   yyy: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
//   zzz: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   },
// };