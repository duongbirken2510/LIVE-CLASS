import { useEffect, useState, type ReactNode } from 'react';
import type { LiveStatus } from './types';
import { emitTest, sendControl } from './page';

interface VieneuVoice {
  id: string;
  name: string;
  description: string;
  gender: string;
}
interface VieneuStatus {
  state: 'loading' | 'ready' | 'unavailable';
  voice: string;
  voices: VieneuVoice[];
}

const FAKE_NAMES = ['Lan Anh', 'Minh Tuấn', 'Bé Na 🌸', 'Hoàng Long', 'Thu Trang', 'Quốc Bảo', 'duyanh99', '𝑵𝒈𝒐̣𝒄 𝑨𝒏𝒉'];
const pick = () => {
  const nickname = FAKE_NAMES[Math.floor(Math.random() * FAKE_NAMES.length)];
  return { nickname, username: nickname.normalize('NFKD').replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'khach' };
};

/**
 * Trang điều khiển (http://localhost:3006). Im lặng, không phát tiếng.
 * Đồng bộ 100% phong cách giao diện với dự án Ai Là Trạng Nguyên.
 */
export function Dashboard({
  status,
  channelName,
  preview,
  extra,
}: {
  status: LiveStatus | null;
  channelName: string;
  preview: ReactNode;
  extra?: ReactNode;
}) {
  const [user, setUser] = useState(() => localStorageGet('tiktokUser'));
  const [nameText, setNameText] = useState('');
  const [msg, setMsg] = useState('');
  const [speakText, setSpeakText] = useState('');
  const [busy, setBusy] = useState(false);
  const [vieneu, setVieneu] = useState<VieneuStatus>({ state: 'loading', voice: 'Trúc Ly', voices: [] });

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const load = () => {
      fetch('/api/tts/status')
        .then((r) => r.json())
        .then((d: VieneuStatus) => {
          setVieneu(d);
          if (d.state === 'loading') timer = setTimeout(load, 2000);
        })
        .catch(() => {});
    };
    load();
    const onVoiceChanged = () => load();
    window.addEventListener('vieneu-voice-changed', onVoiceChanged);
    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener('vieneu-voice-changed', onVoiceChanged);
    };
  }, []);

  const changeVoice = async (newVoice: string) => {
    setVieneu((prev) => ({ ...prev, voice: newVoice.startsWith('__edge_') ? '' : newVoice }));
    try {
      const r = await fetch('/api/tts/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voice: newVoice }),
      }).then((x) => x.json());
      if (r.state) setVieneu(r);
      window.dispatchEvent(new CustomEvent('vieneu-voice-changed'));
      setMsg(
        newVoice === '__edge_f__'
          ? 'Đã đổi sang giọng Microsoft Edge Nữ (Hoài My)'
          : newVoice === '__edge_m__'
            ? 'Đã đổi sang giọng Microsoft Edge Nam (Nam Minh)'
            : `Đã đổi sang giọng AI VieNeu: ${newVoice}`,
      );
    } catch (e) {
      setMsg(String(e));
    }
  };

  const connect = async () => {
    setBusy(true);
    setMsg('');
    localStorageSet('tiktokUser', user);
    try {
      const r = await fetch('/api/tiktok/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user }),
      }).then((x) => x.json());
      setMsg(r.success ? 'Đã kết nối' : r.error);
    } catch (e) {
      setMsg(String(e));
    }
    setBusy(false);
  };

  const disconnect = () => fetch('/api/tiktok/disconnect', { method: 'POST' });

  const speak = async () => {
    const r = await sendControl('speak', speakText);
    setMsg(r.pages > 1 ? `Đã gửi (đang mở ${r.pages} trang)` : 'Đã gửi');
    setSpeakText('');
  };

  const saveName = async () => {
    const r = await sendControl('setName', nameText);
    setMsg(r.success ? `Đã lưu tên kênh: ${nameText.trim()}` : r.error);
    if (r.success) setNameText('');
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 text-slate-100 md:p-6">
      <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-[1fr_auto]">
        <div className="space-y-4">
          <Card title="Kết nối TikTok LIVE">
            <div className="flex flex-wrap gap-2">
              <input
                className="min-w-0 flex-1 rounded-lg bg-slate-800 px-3 py-2"
                placeholder="username TikTok (không cần @)"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && user.trim() && connect()}
              />
              <Btn onClick={connect} disabled={busy || !user.trim()}>
                {busy ? 'Đang nối...' : 'Kết nối'}
              </Btn>
              <Btn onClick={disconnect} tone="ghost">
                Ngắt
              </Btn>
            </div>
            <div className="mt-3 text-sm">
              Trạng thái:{' '}
              {status?.isConnected ? (
                <span className="text-emerald-400">
                  Đang live @{status.username} · {status.viewerCount} người xem · {status.totalLikes} tim
                </span>
              ) : status?.isConnecting ? (
                <span className="text-amber-400">Đang kết nối...</span>
              ) : (
                <span className="text-slate-400">Chưa kết nối</span>
              )}
            </div>
            {(msg || status?.error) && <div className="mt-1 text-sm text-amber-300">{msg || status?.error}</div>}
            <div className="mt-3 rounded-lg bg-slate-800/60 p-3 text-xs text-slate-400">
              Link cho TikTok LIVE Studio:{' '}
              <b className="text-slate-200">http://lvh.me:{window.location.port || 3006}/?view=stage</b> · 1080 × 1920. Chỉ trang đó phát tiếng.
            </div>
          </Card>

          <Card title="Giọng đọc trên stage">
            <div className="mb-3 rounded-xl bg-slate-800/70 p-3 text-sm ring-1 ring-slate-700/60">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium text-slate-200">Bộ giọng đọc Giáo viên:</span>
                {vieneu.state === 'loading' ? (
                  <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-medium text-amber-300">
                    ⏳ Đang nạp model AI VieNeu (~10s)...
                  </span>
                ) : vieneu.state === 'ready' && vieneu.voice ? (
                  <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-medium text-emerald-300">
                    🟢 VieNeu AI sẵn sàng ({vieneu.voice})
                  </span>
                ) : (
                  <span className="rounded-full bg-sky-500/20 px-2.5 py-0.5 text-xs font-medium text-sky-300">
                    🔵 Đang dùng Microsoft Edge (Hoài My / Nam Minh)
                  </span>
                )}
              </div>
              <select
                className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm text-slate-100 ring-1 ring-slate-700 focus:ring-amber-400"
                value={vieneu.voice || '__edge_f__'}
                onChange={(e) => changeVoice(e.target.value)}
              >
                {(vieneu.voices.length > 0
                  ? vieneu.voices
                  : [
                      { id: 'Trúc Ly', name: 'Trúc Ly', description: 'Nữ · Bắc · Phong cách tự nhiên', gender: 'female' },
                      { id: 'Ngọc Huyền', name: 'Ngọc Huyền', description: 'Nữ · Bắc · Giọng đọc tự nhiên', gender: 'female' },
                      { id: 'Adam bựa', name: 'Adam bựa', description: 'Nam · Bắc · Phong cách tự nhiên', gender: 'male' },
                    ]
                ).map((v) => (
                  <option key={v.id} value={v.id}>
                    🎙️ VieNeu AI: {v.name} {v.description ? `— ${v.description}` : ''}
                  </option>
                ))}
                <option value="__edge_f__">🌐 Microsoft Edge (Hoài My — Nữ, nhẹ)</option>
                <option value="__edge_m__">🌐 Microsoft Edge (Nam Minh — Nam, nhẹ)</option>
              </select>
              {vieneu.state === 'unavailable' && (
                <div className="mt-2 rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-200 ring-1 ring-amber-500/30">
                  💡 <b>Máy chưa có giọng AI "Adam bựa"?</b> Hãy cài Python 3.11/3.12 rồi bấm đúp file{' '}
                  <code className="rounded bg-slate-900 px-1.5 py-0.5 text-amber-300">CAI-GIONG-ADAM.bat</code> trong thư mục game để tự động tải và cài đặt từ A–Z.
                </div>
              )}
            </div>
            <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
              <span>
                Tên kênh: <b className="text-amber-300">{channelName}</b>
              </span>
              <input
                className="min-w-0 flex-1 rounded-lg bg-slate-800 px-3 py-2"
                placeholder="Đổi tên kênh mà giọng đọc xưng..."
                maxLength={40}
                value={nameText}
                onChange={(e) => setNameText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && nameText.trim() && saveName()}
              />
              <Btn onClick={saveName} disabled={!nameText.trim()}>
                Lưu tên
              </Btn>
            </div>
            <div className="flex gap-2">
              <input
                className="min-w-0 flex-1 rounded-lg bg-slate-800 px-3 py-2"
                placeholder="Gõ câu muốn đọc ngay..."
                value={speakText}
                onChange={(e) => setSpeakText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && speakText.trim() && speak()}
              />
              <Btn onClick={speak} disabled={!speakText.trim()}>
                Đọc ngay
              </Btn>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              Tốc độ:
              {['0.85', '1', '1.15', '1.3'].map((r) => (
                <Btn key={r} tone="ghost" onClick={() => sendControl('setRate', r)}>
                  {r}×
                </Btn>
              ))}
              <Btn tone="danger" onClick={() => confirmReset()}>
                Reset game
              </Btn>
            </div>
          </Card>

          <Card title="Giả lập (test khi chưa live)">
            <div className="flex flex-wrap gap-2">
              <Btn tone="ghost" onClick={() => emitTest('member', pick())}>
                👋 Người vào
              </Btn>
              <Btn tone="ghost" onClick={() => emitTest('chat', { ...pick(), comment: 'vào lớp' })}>
                ✋ Gõ "vào lớp"
              </Btn>
              <Btn tone="ghost" onClick={() => emitTest('chat', { ...pick(), comment: 'Live hay quá' })}>
                💬 Comment
              </Btn>
              <Btn tone="ghost" onClick={() => emitTest('chat', { ...pick(), comment: 'mong mai thi được điểm cao' })}>
                🙏 Comment cầu chúc
              </Btn>
              <Btn
                tone="ghost"
                onClick={() => emitTest('gift', { ...pick(), giftName: 'rose', giftId: 5655, diamondCount: 1, repeatCount: 5 })}
              >
                🌹 5 Hoa hồng
              </Btn>
              <Btn
                tone="ghost"
                onClick={() => emitTest('gift', { ...pick(), giftName: 'Sư tử', giftId: 6369, diamondCount: 29999, repeatCount: 1 })}
              >
                🦁 Quà to
              </Btn>
              <Btn tone="ghost" onClick={() => comboSameUser()}>
                🔁 1 người tặng 3 lần liền
              </Btn>
              <Btn tone="ghost" onClick={() => emitTest('follow', pick())}>
                ➕ Follow
              </Btn>
              <Btn tone="ghost" onClick={() => emitTest('like', { ...pick(), likeCount: 100 })}>
                ❤️ 100 tim
              </Btn>
            </div>
            <p className="mt-2 text-xs text-slate-500">Sự kiện giả đi tới mọi trang đang mở, kể cả stage trong LIVE Studio.</p>
          </Card>

          {extra}

          <Card title="Thông tin dự án & Tác giả (Info)">
            <div className="space-y-2.5 text-sm text-slate-300">
              <p>
                <b className="text-amber-300">LIVE-CLASS (v2.0)</b> — Game show lớp học đa chủ đề &amp; vượt cấp học tương tác tự động 100% cho TikTok LIVE, phát triển và nâng cấp bởi{' '}
                <a
                  href="https://duongbirken.deta.vn"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-amber-400 underline decoration-amber-400/50 hover:text-amber-300"
                >
                  Duong Birken
                </a>
                .
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <a
                  href="https://duongbirken.deta.vn"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-2 text-xs font-semibold text-slate-950 hover:bg-amber-400"
                >
                  🌐 Website: duongbirken.deta.vn
                </a>
                <a
                  href="/bao-cao"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3.5 py-2 text-xs font-medium text-slate-100 ring-1 ring-slate-700 hover:bg-slate-700"
                >
                  📊 Báo cáo buổi Live hôm nay
                </a>
              </div>
            </div>
          </Card>
        </div>

        <div className="justify-self-center">
          <div className="mb-2 text-center text-sm text-slate-400">Xem trước (im lặng)</div>
          <div className="overflow-hidden rounded-2xl ring-1 ring-slate-700">{preview}</div>
        </div>
      </div>
    </div>
  );
}

// Cùng 1 người tặng 3 lần cách nhau 1 giây: chỉ được cảm ơn 1 lần
function comboSameUser() {
  const who = pick();
  for (let i = 0; i < 3; i++) {
    setTimeout(() => emitTest('gift', { ...who, giftName: 'rose', giftId: 5655, diamondCount: 1, repeatCount: 1 }), i * 1000);
  }
}

function confirmReset() {
  void sendControl('reset');
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl bg-slate-900 p-4 ring-1 ring-slate-800">
      <h2 className="mb-3 font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Btn({
  children,
  onClick,
  disabled,
  tone = 'primary',
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  tone?: 'primary' | 'ghost' | 'danger';
}) {
  const cls = {
    primary: 'bg-amber-500 text-slate-950 hover:bg-amber-400',
    ghost: 'bg-slate-800 hover:bg-slate-700',
    danger: 'bg-rose-700 hover:bg-rose-600',
  }[tone];
  return (
    <button onClick={onClick} disabled={disabled} className={`rounded-lg px-3 py-2 text-sm font-medium disabled:opacity-40 ${cls}`}>
      {children}
    </button>
  );
}

function localStorageGet(k: string) {
  try {
    return localStorage.getItem(k) || '';
  } catch {
    return '';
  }
}
function localStorageSet(k: string, v: string) {
  try {
    localStorage.setItem(k, v);
  } catch {
    // bỏ qua
  }
}
