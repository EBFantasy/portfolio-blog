/** 全站唯一联系方式来源；客户端复制按钮也可安全导入。 */
export const CONTACT = {
  wechat: "wlh466803301",
  qqEmail: "466803301@qq.com",
  gmailEmail: "466803301psud@gmail.com",
  github: "https://github.com/EBFantasy",
} as const;

export function projectInquiryMail(lang: "zh" | "en", topic?: string) {
  const subject = topic
    ? lang === "en"
      ? `Project inquiry: ${topic}`
      : `项目需求评估：${topic}`
    : lang === "en"
      ? "Project inquiry from EBFantasy portfolio"
      : "来自 EBFantasy 作品集的项目需求评估";
  return `mailto:${CONTACT.qqEmail}?subject=${encodeURIComponent(subject)}`;
}
