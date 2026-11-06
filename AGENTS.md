# AGENTS.md — 个人健康室（health-room）

你是本仓库的编码与档案整理代理。用户是蒋元甲（Jasper）。你**不是医生**，不做诊断、不开药。

## 当前阶段：空壳实现

1. 仔细阅读 `docs/superpowers/specs/2026-11-06-health-room-design.md`（唯一完整规格）。
2. 对照 `_ref/frames/*.png` 的视觉（浅灰底、荧光绿强调、近黑选中卡、中央人体、右侧分系统卡）。
3. 按设计文档第 7 节清单实现静态 Web 空壳 + 占位数据。
4. 个人版：不要做多成员家庭切换；关系文案用「本人」。
5. 不要编造体检数值；`labs` 的 value 保持 null / pending。
6. 完成后 `git commit`；不要强制 push 远程，除非用户或调度方明确要求。
7. 用中文简短汇报：做了什么、如何打开 `web/index.html`、已知限制。

## 技术约束

- 纯静态：`web/index.html`、`styles.css`、`app.js`；无构建工具、无 React/Vue（除非规格变更）。
- CSS 必须使用设计文档中的 CSS 变量名与色板。
- 数据只读 `data/**`；原始报告在 `raw/`。
- 若 `file://` 无法 fetch JSON，在 README 写明本地静态服务器一条命令，并优先让页面在静态服务器下工作。

## 数据契约与目录约定

- `web/` 仅负责展示；`data/` 是页面的只读数据源；`raw/` 保留原始 PDF 或截图，页面不自动扫描或导入。
- JSON 使用 UTF-8。完整 schema 以设计文档第 5 节为准，字段保持齐全；未知值用 `null`、空字符串或空数组，不编造数值。
- `profile.json` 必含 `display_name,relation_label,sex,birth_date,age,height_cm,weight_kg,location,avatar,checkup_org,checkup_package,checkup_date,key_labs_preview,lifestyle,status`；`lifestyle` 包含 `work,smoking,sleep,allergies`。
- `labs.json` 为 `{ updated_at, items[] }`；每项必含 `id,name,name_zh,value,unit,ref_range,date,source,system_id,flag`。`flag` 只允许 `normal | watch | abnormal | pending`；空壳 `value: null`、`flag: "pending"`。导入后 `source` 必须对应 `raw/` 中真实文件名。
- `systems/<id>.json` 必含 `id,title,status,priority_note,history[],latest_known[],related_lab_ids[]`；关联指标 ID 必须存在于 `labs.json`。
- `meds.json` 空壳为 `{ "items": [] }`；`plan.json` 为任务数组，每项含 `id,title,detail,status,actions[]`，`actions` 为字符串数组。空壳仅给非医疗示例，标题注明「示例」，状态为「待安排」。
- `ai-notes.md` 末尾与 AI 页面固定保留：「仅供个人资料整理与学习，不构成诊疗建议」。
- 本项目仅供个人整理体检资料与学习，不提供诊断或治疗建议。任何异常以医疗机构结论为准。

## 报告导入阶段（空壳完成且用户放入 raw 后才做）

当用户说「导入美年报告」时：

1. 读取 `raw/` 中最新文件。
2. 更新 `data/labs.json`、`data/systems/*.json`、`data/profile.json`、`data/plan.json`、`data/ai-notes.md`。
3. 每条 lab 填写 `source` 为 raw 文件名；禁止无来源数值。
4. `ai-notes.md` 末尾保留免责声明；异常项写「建议线下复诊」。

## 禁止

- 把健康数据发到公开渠道
- 大幅偏离参考视觉改成其他设计体系
- 删除 `_ref/` 参考帧
