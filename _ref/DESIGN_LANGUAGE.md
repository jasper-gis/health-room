# 个人健康室 · 设计语言

摘录自 `docs/superpowers/specs/2026-11-06-health-room-design.md` 第 4 节。完整规格以设计文档为准；对照 `frames/` 中 f_003、f_007、f_012、f_018、f_022、f_028。

## 整体视觉

浅暖灰背景、半透明玻璃白卡、荧光绿强调。选中的身体系统使用整卡近黑底，配浅色文字与荧光绿图标。中央半透明人体与细线器官热点构成视觉焦点。不改为蓝色医疗风或全局深色主题。

## 固定 CSS 变量

```css
:root {
  --bg-page: #c8c0c0;
  --bg-elevated: #f3f1f1;
  --bg-card: rgba(255,255,255,0.72);
  --bg-card-selected: #121214;
  --text-primary: #1a1a1c;
  --text-secondary: #6b6565;
  --text-on-dark: #f5f5f5;
  --accent: #d6ff2f;
  --accent-ink: #1a1a1c;
  --danger: #e85d4c;
  --watch: #f0a202;
  --ok: #3bb273;
  --border-subtle: rgba(0,0,0,0.06);
  --shadow-card: 0 8px 28px rgba(0,0,0,0.08);
  --radius-card: 16px;
  --radius-pill: 999px;
  --font-sans: "Segoe UI", "PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif;
}
```

## 布局、字形与质感

- 桌面三栏约为 22% / 38% / 40%：本人资料、人体、分系统卡。顶栏约 56–64px，时间轴约 48px。主体垂直居中，窄屏允许上下堆叠。
- 顶栏六个 Tab 顺序固定：身体关注、资料依据、检查与指标、用药、近期安排、AI 分析。选中 Tab 使用荧光绿胶囊。
- 标题 14–16px / 600；Tab 13–14px / 500；分系统标题 16–18px / 600；正文 12–13px / 400；角标 11px / 500。
- 卡片和按钮约 12–16px 圆角、轻阴影；图标为细线描边，置于圆形或软方角容器。
- 热点选中时荧光绿高亮，1px 低透明引导线连接到选中系统卡；动画需尊重减少动态效果偏好。
- 个人版仅保留本人资料，关系写「本人」。文案冷静、简短，空状态统一「待美年报告填入」，不显示虚构化验值。

AI 页固定文案：「仅供个人资料整理与学习，不构成诊疗建议」。人体是导航示意，不是医学影像。
