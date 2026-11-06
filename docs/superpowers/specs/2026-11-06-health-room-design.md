# 个人健康室（health-room）详细设计文档

- 日期：2026-11-06（Asia/Singapore）
- 状态：定稿，交给本机 Codex（`gpt-6-astra` + `model_reasoning_effort = ultra`）实施空壳
- 所有者：蒋元甲（Jasper）
- 审美审核：总管Bot（实施后对照 `_ref/frames/` 与本文件做视觉验收）
- 参考视频：小红书「青媒素LAB」《把Codex变成私人医生！》演示的《家人健康室》；本项目为**个人版**，不做多成员家庭切换

## 0. 一句话目标

做一个本地静态「健康室」空壳：视觉与参考视频对齐（浅灰玻璃卡片 + 荧光绿强调 + 中央半透明人体 + 右侧分系统卡），数据先占位；美年报告到位后由 Codex 按 `AGENTS.md` 填入。仓库 GitHub 私有，公司机与家里 Win/Mac 都能打开。

## 1. 非目标

- 不做诊断、开药、急诊分流
- 不做 Electron / Tauri / 原生壳（第一版纯静态 Web）
- 不做账号体系与云端后端
- 第一版不做真实 3D 引擎（Three.js 可选增强；默认用 SVG/CSS 半透明人体示意即可，但版式必须像参考）
- 空壳阶段不填真实美年数值

## 2. 仓库与路径

| 项 | 值 |
|---|---|
| 本地路径（公司机） | `C:\Users\admin\Documents\Codex\health-room` |
| 建议远程 | GitHub 私有仓 `jasper-gis/health-room`（若占用则改名并记入 README） |
| 打开方式 | 浏览器打开 `web/index.html`；若 `file://` 下 fetch JSON 失败，用任意静态服务器（README 写明一条命令） |

### 2.1 目录树（必须按此创建）

```
health-room/
  README.md
  AGENTS.md
  .gitignore
  docs/superpowers/specs/2026-11-06-health-room-design.md   # 本文件
  _ref/
    note.mp4                    # 参考视频（已存在可保留）
    frames/                     # 参考帧 PNG（实施时对照）
    DESIGN_LANGUAGE.md          # 可从本文件第 4 节摘录
  web/
    index.html
    styles.css
    app.js
    assets/
      body.svg                  # 半透明人体示意
      icons/                    # 线型图标
  data/
    profile.json
    labs.json
    meds.json
    plan.json
    ai-notes.md
    systems/
      cardiovascular.json
      kidney.json
      hepatobiliary.json
      lung.json
      thyroid.json
      oncology-markers.json
      general.json
  raw/
    README.md                   # 说明：美年 PDF/截图放这里；已纳入 git
```

### 2.2 `.gitignore`

忽略：`.DS_Store`、`Thumbs.db`、`*.log`、`.venv/`、`node_modules/`、编辑器目录。  
**不要**忽略 `raw/`、`data/`、`_ref/frames/`。

## 3. 信息架构（个人版）

参考视频顶栏有多成员头像；**本项目去掉多成员切换**，左上只保留本人头像/姓名占位。

### 3.1 顶栏 Tab（顺序与文案固定）

1. 身体关注（默认）
2. 资料依据
3. 检查与指标
4. 用药
5. 近期安排
6. AI 分析

右侧可有：音量/通知占位、黄色「+」按钮、设置齿轮（可先无功能）。

### 3.2「身体关注」主布局（三栏）

| 区域 | 内容 |
|---|---|
| 左栏 | 本人资料卡：头像、姓名、关系文案改为「本人」；身高/体重/生日占位；「关键指标」两条占位；「生活与过敏」占位 |
| 中栏 | 半透明人体；器官热点（心/肺/肝/肾等）圆形线框图标；选中系统用荧光绿脉冲；细引导线连到右栏选中卡；底部年份时间轴 2023–2026（可点但空壳可不筛数据） |
| 右栏 | 分系统卡片栈。选中卡：**深色（近黑）底 + 浅绿/黄图标**；未选中：浅灰白卡片。每卡旁可有「重要经过」「最近已知」两列短文（占位） |

分系统起步集合（个人版，对齐美年综合套餐）：

1. 心血管  
2. 肾脏与排尿  
3. 肝胆与代谢  
4. 肺部  
5. 甲状腺  
6. 肿瘤相关指标  
7. 一般检查与影像  

### 3.3 其他 Tab（空壳也要有完整页面骨架）

- **资料依据**：列表展示 `raw/` 与已解析来源说明（空则显示「待放入美年报告」）
- **检查与指标**：表格/卡片读 `labs.json`；列：名称、值、单位、参考范围、日期、状态旗标
- **用药**：读 `meds.json`（可空列表）
- **近期安排**：任务卡列表（状态角标如「待安排」）；主按钮用荧光绿；文案区标题可用「随访与安排」
- **AI 分析**：渲染 `ai-notes.md`（Markdown→HTML）；页脚固定免责声明

### 3.4 交互

- 点击人体热点或右栏卡片 → 切换选中系统（深色卡 + 热点高亮 + 引导线）
- 点击指标缩写 → 术语弹层（圆角白卡，标题+一行解释），示例：`LDL-C` → 「低密度脂蛋白胆固醇」
- Tab 切换不刷新整页，纯前端状态

## 4. 设计语言（必须对齐参考帧）

对照 `_ref/frames/`（已从参考视频抽取）。关键词：**浅色医疗 OS、玻璃拟态卡片、荧光绿强调、选中态反白为近黑卡**。

### 4.1 色板（CSS 变量名固定）

```css
:root {
  --bg-page: #c8c0c0;          /* 页面暖灰底（参考帧主背景感） */
  --bg-elevated: #f3f1f1;      /* 抬起的浅卡片 */
  --bg-card: rgba(255,255,255,0.72); /* 玻璃白 */
  --bg-card-selected: #121214; /* 选中分系统卡近黑 */
  --text-primary: #1a1a1c;
  --text-secondary: #6b6565;
  --text-on-dark: #f5f5f5;
  --accent: #d6ff2f;           /* 荧光绿/柠檬黄：激活 Tab、热点、主按钮、+ */
  --accent-ink: #1a1a1c;       /* 强调色上的字 */
  --danger: #e85d4c;           /* 异常旗标（慎用） */
  --watch: #f0a202;            /* 关注 */
  --ok: #3bb273;               /* 正常 */
  --border-subtle: rgba(0,0,0,0.06);
  --shadow-card: 0 8px 28px rgba(0,0,0,0.08);
  --radius-card: 16px;
  --radius-pill: 999px;
  --font-sans: "Segoe UI", "PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif;
}
```

说明：参考帧经采样背景约 `#c0b8b8`–`#c8c0c0`；强调色为高饱和黄绿（视频字幕条同色系）。实现时可微调 ±5%，但不得改成蓝色医疗风或深色全局主题。

### 4.2 字体层级

| 角色 | 大约大小 | 字重 | 颜色 |
|---|---|---|---|
| 窗口标题「健康室」 | 14–16px | 600 | primary |
| Tab 标签 | 13–14px | 500 | 未选 secondary；选中在 accent 胶囊上用 accent-ink |
| 分系统卡标题 | 16–18px | 600 | 未选 primary；选中 text-on-dark |
| 正文/指标 | 12–13px | 400 | secondary / primary |
| 角标「待安排」 | 11px | 500 | 深字浅底或 accent |

禁止花哨装饰字体；中英文都用同一套 sans。

### 4.3 形状与质感

- 卡片、按钮、Tab：大圆角（约 12–16px；Tab 用 pill）
- 轻阴影 + 半透明白，体现玻璃感；不要厚重 Material 阴影
- 图标：细线描边，放在圆形或软方角容器内
- 选中心血管等卡：整卡近黑，图标可用 accent
- 引导线：1px 细线，从热点连到选中卡，颜色可用 accent 低透明

### 4.4 布局比例（桌面宽 ≥1280）

- 左栏约 22% · 中栏约 38% · 右栏约 40%
- 顶栏高度约 56–64px
- 底时间轴高度约 48px
- 主体区垂直居中，避免贴边

窄屏可降级为上下堆叠，但优先保证桌面三栏观感（用户主要在 Win/Mac 桌面用）。

### 4.5 文案语气

- 界面中文；冷静、短句；不要营销腔
- 空状态统一：「待美年报告填入」
- AI 页固定免责：「仅供个人资料整理与学习，不构成诊疗建议」

## 5. 数据模型（字段必须齐全）

### 5.1 `data/profile.json`

```json
{
  "display_name": "蒋元甲",
  "relation_label": "本人",
  "sex": "男",
  "birth_date": "",
  "age": null,
  "height_cm": null,
  "weight_kg": null,
  "location": "北京",
  "avatar": "",
  "checkup_org": "美年大健康",
  "checkup_package": "综合套餐",
  "checkup_date": "2026-11-04",
  "key_labs_preview": [],
  "lifestyle": {
    "work": "",
    "smoking": "",
    "sleep": "",
    "allergies": "暂无"
  },
  "status": "pending_report"
}
```

### 5.2 `data/labs.json`

```json
{
  "updated_at": "",
  "items": [
    {
      "id": "lab_example_ldl",
      "name": "LDL-C",
      "name_zh": "低密度脂蛋白胆固醇",
      "value": null,
      "unit": "mmol/L",
      "ref_range": "",
      "date": "",
      "source": "",
      "system_id": "cardiovascular",
      "flag": "pending"
    }
  ]
}
```

`flag` ∈ `normal | watch | abnormal | pending`

### 5.3 `data/systems/<id>.json`

```json
{
  "id": "cardiovascular",
  "title": "心血管",
  "status": "pending",
  "priority_note": "待美年报告填入",
  "history": [],
  "latest_known": [],
  "related_lab_ids": []
}
```

### 5.4 `data/meds.json` / `plan.json` / `ai-notes.md`

- `meds.json`：`{ "items": [] }`
- `plan.json`：任务数组，字段 `id,title,detail,status,actions[]`；空壳给 2–3 条示例任务且 `status: "待安排"`，标题标明示例
- `ai-notes.md`：一段占位说明 + 免责声明

### 5.5 规则

- 禁止编造真实化验数值；空壳 value 一律 `null` 或省略
- 每个将来写入的 lab 必须能指向 `raw/` 中文件名（`source` 字段）

## 6. Codex 工作流（`AGENTS.md` 要点）

实施时空壳阶段：按本文搭 UI + 数据骨架。  
报告到位后（未来任务）：用户把 PDF 放入 `raw/`，对仓库根目录运行 Codex：「按 AGENTS.md 导入最新美年报告」。

`AGENTS.md` 必须包含：角色（档案整理非医生）、目录约定、JSON schema、中文输出、禁止编造、导入步骤、免责声明。

## 7. 实施任务拆分（给 Codex 的验收清单）

按顺序完成，全部打勾才算空壳完成：

1. [x] 建齐目录与 `.gitignore`、`README.md`、`AGENTS.md`
2. [x] 写入全部 `data/*` 占位文件（合法 JSON）
3. [x] `web/index.html` + `styles.css` + `app.js` 实现三栏「身体关注」与全部 Tab 骨架
4. [x] CSS 变量使用第 4 节色板；选中卡近黑；Tab 荧光绿胶囊
5. [x] 人体示意 + 热点切换 + 术语弹层
6. [x] 底栏时间轴 UI
7. [x] `raw/README.md` 说明如何放入报告
8. [x] 本地打开验证；截图保存到 `_ref/impl-screenshots/`（若环境允许）
9. [x] `git add` + commit（清晰中文或英文 commit message）
10. [x] **不要**创建 GitHub 远程除非指令明确（远程推送由总管Bot另调度）

## 8. 审美审核标准（总管Bot用）

对照 `_ref/frames/f_003.png`、`f_007.png`、`f_012.png`、`f_018.png`、`f_022.png`、`f_028.png`：

- 是否浅灰底而非纯白或深色全局
- 是否荧光绿强调而非蓝/青医疗风
- 选中分系统卡是否近黑反差
- 三栏比例与大圆角玻璃卡是否接近参考
- 中文标签是否与第 3.1 节一致
- 空状态是否克制、无假数据

不通过则开 Codex 返工，指出具体帧与差异。

## 9. 免责声明（写入 README 与 AI 页）

本项目仅供个人整理体检资料与学习，不提供诊断或治疗建议。任何异常以医疗机构结论为准。

## 10. 调度说明

- 实现代理：本机 Codex CLI，`model=gpt-6-astra`，`model_reasoning_effort=ultra`（已在用户 `~/.codex/config.toml`）
- 调度方：总管Bot（`codex exec`，工作目录为仓库根）
- 用户不方便截图时，以 `_ref/frames/` 为准
