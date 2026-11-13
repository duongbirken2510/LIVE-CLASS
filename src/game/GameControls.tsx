import { useEffect, useRef, useState } from 'react';
import { emitTest, sendControl } from '../live/page';
import type { StageView } from './useGame';
import { GAME, shownTeacherName, type RoomCfg } from './config';

const HO = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Đặng', 'Bùi'];
const TEN = ['Lan Anh', 'Minh Tuấn', 'Thu Trang', 'Quốc Bảo', 'Ngọc Hân', 'Gia Huy', 'Khánh Linh', 'Hải Yến', 'Đức Anh', 'Bảo Ngọc', 'Thanh Hà', 'Văn Toàn'];
const CHAT = ['khó quá cô ơi', 'chữ gì vậy trời', 'hay quá', 'vào lớp', 'cô xinh quá', 'ủa là gì', '???', 'hihi'];
const fake = (i: number) => ({ username: `hs${i}`, nickname: `${HO[i % HO.length]} ${TEN[i % TEN.length]}`, avatar: '' });
const shuffleWord = (w: string) => [...w].sort(() => Math.random() - 0.5).join('');

const KY_THI = [
  { nhan: 'CẤP 1 · KHỞI ĐỘNG', moTa: 'Câu 1–5' },
  { nhan: 'CẤP 2 · TĂNG TỐC', moTa: 'Câu 6–10' },
  { nhan: 'CẤP 3 · BỨT PHÁ', moTa: 'Câu 11–15' },
  { nhan: 'TÚ TÀI · VỀ ĐÍCH', moTa: 'Câu 16–20' },
];

export function GameControls({ view, stageCount = 0 }: { view: StageView | null; stageCount?: number }) {
  const btn = 'rounded-xl px-4 py-2 text-sm font-semibold transition disabled:opacity-40';
  const o = 'mt-1 w-full rounded-lg bg-black/40 px-3 py-2 text-sm text-white outline-none ring-1 ring-white/15 focus:ring-amber-400';

  const [cfg, setCfg] = useState<RoomCfg>(GAME.defaultRoom);
  const [teacherName, setTeacherName] = useState('');
  const [motto, setMotto] = useState('');
  const [daLuu, setDaLuu] = useState('');
  const [stopAt, setStopAt] = useState<number | null>(null);
  const [remainSec, setRemainSec] = useState(0);
  const [sent, setSent] = useState(0);
  const [running, setRunning] = useState(false);
  const [bdName, setBdName] = useState('');
  const [mins, setMins] = useState('');
  const [danceText, setDanceText] = useState('');
  const [danceSec, setDanceSec] = useState('');
  const [bdText, setBdText] = useState('');
  const file = useRef<HTMLInputElement>(null);

  const load = (r: Partial<RoomCfg>) => {
    const merged = { ...GAME.defaultRoom, ...r };
    setCfg(merged);
  };

  useEffect(() => {
    fetch('/api/room-settings')
      .then((r) => r.json())
      .then(load)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!stopAt) {
      setRemainSec(0);
      return;
    }
    const tick = () => {
      const left = Math.max(0, Math.ceil((stopAt - Date.now()) / 1000));
      setRemainSec(left);
      if (left <= 0) {
        setStopAt(null);
        void sendControl('custom', 'goodbye');
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [stopAt]);

  const fmtTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const save = async (patch: Partial<RoomCfg>, done: string) => {
    const r = await fetch('/api/room-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    }).then((x) => x.json());
    setDaLuu(r.success ? done : r.error);
    if (r.success) {
      load(r.room);
      window.dispatchEvent(new CustomEvent('vieneu-voice-changed'));
    }
    return r.success as boolean;
  };

  const luuTenVaBang = async () => {
    const patch: Partial<RoomCfg> = {};
    if (teacherName.trim()) patch.teacherName = teacherName.trim();
    if (motto.trim()) patch.motto = motto.trim();
    if (Object.keys(patch).length === 0) {
      setDaLuu('Đã giữ nguyên tên mặc định');
      return;
    }
    const ok = await save(patch, 'Đã lưu, màn hình đổi ngay');
    if (ok) {
      setTeacherName('');
      setMotto('');
    }
  };

  const upload = async (f: File | undefined) => {
    if (!f) return;
    setDaLuu('Đang tải ảnh nền lên...');
    const r = await fetch('/api/room-bg', { method: 'POST', headers: { 'Content-Type': f.type }, body: f })
      .then((x) => x.json())
      .catch(() => ({ success: false, error: 'Ảnh quá lớn hoặc không đúng loại (PNG, JPG, WEBP, tối đa 12 MB)' }));
    setDaLuu(r.success ? 'Đã đổi nền lớp' : r.error);
    if (r.success) load(r.room);
    if (file.current) file.current.value = '';
  };

  const resetBg = async () => {
    const r = await fetch('/api/room-bg', { method: 'DELETE' }).then((x) => x.json());
    setDaLuu('Đã về nền gốc');
    load(r.room);
  };

  const flood = async (n: number) => {
    if (!view?.answer || running) return;
    setRunning(true);
    setSent(0);
    const answer = view.answer.toLowerCase();
    const start = Date.now();
    let done = 0;
    await Promise.all(
      Array.from({ length: n }, (_, i) => {
        const r = Math.random();
        const comment = r < 0.2 ? answer : r < 0.45 ? shuffleWord(answer) : CHAT[i % CHAT.length];
        const delay = Math.random() * 8_000;
        return new Promise<void>((ok) =>
          setTimeout(async () => {
            await emitTest('chat', { ...fake(i), comment, createTime: start + delay - Math.random() * 1200 }).catch(() => {});
            setSent(++done);
            ok();
          }, delay),
        );
      }),
    );
    setRunning(false);
  };

  return (
    <div className="space-y-3 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
      {stageCount > 1 && (
        <div className="rounded-lg bg-red-600 p-2 text-xs font-semibold text-white">
          ⚠️ Đang mở {stageCount} trang stage, sẽ có 2 giọng đè nhau. Hãy đóng bớt đi!
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="font-bold text-amber-300">LIVE-CLASS</div>
        {view && (
          <div className="text-xs text-slate-300">
            Tiết <b>{view.round}</b> · Câu <b>{view.qNo}/{view.total}</b> · Đáp án:{' '}
            <b className="rounded bg-amber-500/20 px-1.5 py-0.5 text-amber-300">{view.answer || '—'}</b> · Đúng:{' '}
            <b className="text-emerald-400">{view.correctCount}</b>/{view.stats.attempts} ({view.players} học sinh)
          </div>
        )}
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <label className="text-sm text-white/70">
          Người đứng lớp (Nhân vật)
          <select
            className={o}
            value={cfg.teacher}
            onChange={(e) => {
              const teacher = e.target.value as RoomCfg['teacher'];
              const patch: Partial<RoomCfg> = { teacher, teacherVoice: teacher === 'thay' ? 'nam' : 'nu' };
              if (teacher === 'thay' && /^cô(\s|$)/i.test(cfg.teacherName)) patch.teacherName = GAME.defaultThayName;
              if (teacher === 'co' && /^thầy(\s|$)/i.test(cfg.teacherName)) patch.teacherName = GAME.defaultRoom.teacherName;
              void save(patch, teacher === 'thay' ? 'Đã đổi sang Thầy giáo (giọng nam)' : 'Đã đổi sang Cô Ngân (giọng nữ)');
            }}
          >
            <option value="co" className="bg-slate-900">👩‍🏫 Cô Ngân (Giáo viên Nữ)</option>
            <option value="thay" className="bg-slate-900">👨‍🏫 Thầy Minh (Giáo viên Nam)</option>
          </select>
        </label>
        <label className="text-sm text-white/70">
          Tên {cfg.teacher === 'thay' ? 'thầy' : 'cô'} giáo (bảng tên cài áo)
          <input
            className={o}
            value={teacherName}
            maxLength={24}
            placeholder={shownTeacherName(cfg)}
            onChange={(e) => setTeacherName(e.target.value)}
          />
        </label>
        <label className="text-sm text-white/70">
          Chữ khẩu hiệu bảng đỏ (tối đa 40 ký tự)
          <input
            className={o}
            value={motto}
            maxLength={40}
            placeholder={cfg.motto}
            onChange={(e) => setMotto(e.target.value)}
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button className={`${btn} bg-emerald-700 text-white hover:bg-emerald-600`} onClick={luuTenVaBang}>
          💾 Lưu tên
        </button>
        <span className="text-sm text-white/60">{daLuu || 'Để trống là dùng tên mặc định'}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          className={`${btn} bg-amber-600 text-white hover:bg-amber-500`}
          onClick={() => {
            setStopAt(null);
            void sendControl('custom', 'newRound');
          }}
        >
          ▶ Bắt đầu ván mới ngay
        </button>
        <button className={`${btn} bg-slate-700 text-white hover:bg-slate-600`} onClick={() => sendControl('custom', 'skip')}>
          ⏭ Qua phần tiếp
        </button>
        <button
          className={`${btn} bg-red-800 text-white hover:bg-red-700`}
          disabled={!view?.answer || !!view.math || !['question', 'bonus', 'reveal'].includes(view.phase)}
          onClick={() => sendControl('custom', 'ban')}
        >
          🚫 Bỏ câu này
        </button>
        <button
          className={`${btn} bg-rose-600 text-white ring-1 ring-rose-400/50 hover:bg-rose-500`}
          onClick={() => {
            setStopAt(null);
            void sendControl('custom', 'goodbye');
          }}
        >
          🛑 Tắt Live ({cfg.teacher === 'thay' ? 'Thầy giáo' : 'Cô Ngân'} chào tạm biệt)
        </button>
      </div>

      <div className="rounded-xl bg-black/30 p-3 ring-1 ring-white/10">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs text-white/75">
          <span>⏰ Hẹn giờ tự động dừng game &amp; {cfg.teacher === 'thay' ? 'Thầy giáo' : 'Cô Ngân'} đọc lời chào tắt Live:</span>
          {stopAt ? (
            <span className="rounded-full bg-rose-500/20 px-2.5 py-0.5 font-bold text-rose-300">
              ⏳ Tự kết thúc sau {fmtTime(remainSec)}
            </span>
          ) : (
            <span className="text-white/40">Chưa hẹn giờ</span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {[15, 30, 60, 90, 120].map((phut) => (
            <button
              key={phut}
              className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20"
              onClick={() => setStopAt(Date.now() + phut * 60_000)}
            >
              +{phut} phút
            </button>
          ))}
          {stopAt && (
            <button
              className="rounded-lg bg-rose-900/60 px-3 py-1.5 text-xs font-semibold text-rose-200 hover:bg-rose-800"
              onClick={() => setStopAt(null)}
            >
              ✖ Hủy hẹn giờ
            </button>
          )}
        </div>
      </div>

      <div className="text-sm text-white/60">Chuyển nhanh kỳ thi (đổi bối cảnh bảng đen &amp; trang phục giáo viên):</div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {KY_THI.map((v, i) => (
          <button
            key={i}
            className="rounded-xl bg-amber-500/15 px-3 py-2 text-xs font-bold text-amber-200 ring-1 ring-amber-400/30 hover:bg-amber-500/30"
            onClick={() => sendControl('custom', `vong:${i}`)}
          >
            Kỳ {i + 1}: {v.nhan}
          </button>
        ))}
      </div>

      <div className="text-sm text-white/60">Giả lập (bấm lúc đang hiện câu hỏi trên bảng):</div>
      <div className="flex flex-wrap gap-2">
        <button
          className={`${btn} bg-white/10 text-white hover:bg-white/20`}
          onClick={() => emitTest('chat', { ...fake(Math.floor(Math.random() * 50)), comment: view?.answer.toLowerCase() ?? '' })}
        >
          1 người đúng
        </button>
        <button className={`${btn} bg-white/10 text-white hover:bg-white/20`} disabled={running} onClick={() => flood(60)}>
          60 người
        </button>
        <button className={`${btn} bg-white/10 text-white hover:bg-white/20`} disabled={running} onClick={() => flood(500)}>
          500 người
        </button>
        {sent > 0 && <span className="self-center text-xs text-amber-300">Đã gửi: {sent}</span>}
      </div>

      <details className="rounded-xl bg-black/25 p-3 text-xs text-slate-300 ring-1 ring-white/10">
        <summary className="cursor-pointer font-semibold text-amber-200">
          ⚙️ Mở rộng: Gameshow lớn (Everest / Chuông Đồng), Giờ ra chơi, Giám thị &amp; Cài đặt lớp
        </summary>
        <div className="mt-3 space-y-2.5">
          <div className="flex flex-wrap gap-1.5">
            <button className="rounded-lg bg-sky-700 px-3 py-1.5 font-semibold text-white hover:bg-sky-600" onClick={() => sendControl('custom', 'show:everest')}>
              🏔️ Chơi ngay: Đường lên đỉnh Everest
            </button>
            <button className="rounded-lg bg-amber-700 px-3 py-1.5 font-semibold text-white hover:bg-amber-600" onClick={() => sendControl('custom', 'show:chuong')}>
              🔔 Chơi ngay: Rung Chuông Đồng
            </button>
            <button className="rounded-lg bg-slate-700 px-2.5 py-1.5 text-white hover:bg-slate-600" onClick={() => sendControl('custom', 'recess:dance')}>
              💃 Ra chơi: Nhảy múa
            </button>
            <button className="rounded-lg bg-slate-700 px-2.5 py-1.5 text-white hover:bg-slate-600" onClick={() => sendControl('custom', 'recess:rps')}>
              ✊ Oẳn tù tì
            </button>
            <button className="rounded-lg bg-slate-700 px-2.5 py-1.5 text-white hover:bg-slate-600" onClick={() => sendControl('custom', 'recess:callup')}>
              📢 Kiểm tra miệng
            </button>
            <button className="rounded-lg bg-slate-700 px-2.5 py-1.5 text-white hover:bg-slate-600" onClick={() => sendControl('custom', 'recess:roll')}>
              🙋 Điểm danh
            </button>
            <button className="rounded-lg bg-slate-700 px-2.5 py-1.5 text-white hover:bg-slate-600" onClick={() => sendControl('custom', 'escort')}>
              👮 Giám thị vào lớp
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              value={bdName}
              onChange={(e) => setBdName(e.target.value)}
              placeholder="Nhập tên bạn sinh nhật..."
              className="w-48 rounded-lg bg-slate-900 px-2.5 py-1.5 text-white ring-1 ring-white/15"
            />
            <button
              onClick={() => {
                if (bdName.trim()) sendControl('custom', `birthday:${bdName.trim()}`);
                setBdName('');
              }}
              className="rounded-lg bg-pink-700 px-3 py-1.5 font-semibold text-white hover:bg-pink-600"
            >
              🎂 Chúc sinh nhật
            </button>
            <label className="ml-2 flex items-center gap-1">
              <input
                type="checkbox"
                checked={cfg.everest}
                onChange={(e) => save({ everest: e.target.checked }, e.target.checked ? 'Đã bật Everest' : 'Đã tắt Everest')}
              />
              🏔️ Everest tự động
            </label>
            <label className="ml-2 flex items-center gap-1">
              <input
                type="checkbox"
                checked={cfg.chuong}
                onChange={(e) => save({ chuong: e.target.checked }, e.target.checked ? 'Đã bật Rung Chuông Đồng' : 'Đã tắt Rung Chuông Đồng')}
              />
              🔔 Chuông Đồng tự động
            </label>
            <label className="ml-2 flex items-center gap-1">
              <input
                type="checkbox"
                checked={cfg.standWrong}
                onChange={(e) => save({ standWrong: e.target.checked }, e.target.checked ? 'Đã bật lên bục cổ vũ' : 'Đã tắt lên bục cổ vũ')}
              />
              🙋 Lên bục cổ vũ khi sai
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={cfg.supervisor}
                onChange={(e) => save({ supervisor: e.target.checked }, e.target.checked ? 'Đã bật thầy giám thị' : 'Đã tắt thầy giám thị')}
              />
              👮 Giám thị sau
            </label>
            <input
              className="w-14 rounded-lg bg-slate-900 px-2 py-1 text-white ring-1 ring-white/15"
              type="number"
              min={1}
              max={60}
              placeholder={String(cfg.supervisorMin)}
              value={mins}
              onChange={(e) => setMins(e.target.value)}
            />
            <span>phút</span>
            <button
              disabled={!mins}
              onClick={() => save({ supervisorMin: Number(mins) }, 'Đã đổi số phút giám thị').then((ok) => ok && setMins(''))}
              className="rounded-lg bg-slate-700 px-2.5 py-1 text-white disabled:opacity-40"
            >
              Lưu
            </button>
            <span className="ml-2">💃 Nhảy múa:</span>
            <select
              className="rounded-lg bg-slate-900 px-2 py-1 text-white ring-1 ring-white/15"
              value={cfg.dance}
              onChange={(e) => save({ dance: e.target.value as RoomCfg['dance'] }, 'Đã đổi chế độ nhảy múa')}
            >
              <option value="off">Tắt</option>
              <option value="mix">Xen kẽ</option>
              <option value="always">Mọi giờ ra chơi</option>
            </select>
            <input
              className="w-14 rounded-lg bg-slate-900 px-2 py-1 text-white ring-1 ring-white/15"
              type="number"
              min={10}
              max={120}
              placeholder={String(cfg.danceSec)}
              value={danceSec}
              onChange={(e) => setDanceSec(e.target.value)}
            />
            <span>giây</span>
            <button
              disabled={!danceSec}
              onClick={() => save({ danceSec: Number(danceSec) }, 'Đã đổi thời gian nhảy').then((ok) => ok && setDanceSec(''))}
              className="rounded-lg bg-slate-700 px-2.5 py-1 text-white disabled:opacity-40"
            >
              Lưu
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span>Thông báo nhảy:</span>
            <input
              className="min-w-0 flex-1 rounded-lg bg-slate-900 px-2 py-1 text-white ring-1 ring-white/15"
              placeholder={cfg.danceText}
              maxLength={80}
              value={danceText}
              onChange={(e) => setDanceText(e.target.value)}
            />
            <button
              disabled={!danceText.trim()}
              onClick={() => save({ danceText }, 'Đã đổi thông báo nhảy múa').then((ok) => ok && setDanceText(''))}
              className="rounded-lg bg-slate-700 px-2.5 py-1 text-white disabled:opacity-40"
            >
              Lưu
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span>🎂 Biểu ngữ SN:</span>
            <input
              className="min-w-0 flex-1 rounded-lg bg-slate-900 px-2 py-1 text-white ring-1 ring-white/15"
              placeholder={cfg.birthdayText}
              maxLength={60}
              value={bdText}
              onChange={(e) => setBdText(e.target.value)}
            />
            <button
              disabled={!bdText.trim()}
              onClick={() => save({ birthdayText: bdText }, 'Đã đổi chữ biểu ngữ sinh nhật').then((ok) => ok && setBdText(''))}
              className="rounded-lg bg-slate-700 px-2.5 py-1 text-white disabled:opacity-40"
            >
              Lưu
            </button>
            <input ref={file} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => upload(e.target.files?.[0])} />
            <button onClick={() => file.current?.click()} className="rounded-lg bg-slate-700 px-2.5 py-1 text-white hover:bg-slate-600">
              🖼️ Đổi nền lớp...
            </button>
            {cfg.bg && (
              <button onClick={resetBg} className="rounded-lg bg-rose-800 px-2.5 py-1 text-white">
                Về nền gốc
              </button>
            )}
          </div>
        </div>
      </details>
    </div>
  );
}
