// =====================================================
//  LỜI THOẠI CÔ NGÂN. Mỗi tình huống có nhiều câu, game bốc lần lượt kiểu xáo bài
//  (đọc hết cả xấp mới lặp lại) nên live lâu vẫn ít nghe trùng.
//  Muốn thêm câu: chép 1 dòng trong đúng nhóm. Tên người xem luôn là tên đã làm sạch,
//  KHÔNG BAO GIỜ chèn nguyên văn comment vào đây.
//  Kiểm tra: npx tsx src/game/quiz.check.ts (đếm số câu mỗi nhóm, tìm câu trùng)
//
//  HỒ SƠ NHÂN VẬT (chủ kênh duyệt 2026-11-04), viết câu mới thì giữ đúng giọng này:
//  - Cô Ngân, 26 tuổi, cô giáo Gen Z. Đanh đá mà dễ thương: miệng cà khịa nhưng thương học trò, không bao giờ xúc phạm thật.
//  - Gọi người xem là "các bạn" / "bạn", "cả lớp". Xưng "cô". Không gọi "bạn nhỏ", "em", "con", không khen kiểu khen bé.
//  - Khán giả chính: Gen Z và người đi làm. Hay nhắc chuyện lương, deadline, sếp, họp, thứ hai, trà sữa, săn sale, crush.
//  - Miếng hài lặp lại (người xem quen sẽ chờ): cuối tháng cô than lương; trà sữa full topping; sợ thứ hai và họp phụ huynh;
//    thầm crush thầy thể dục mà không dám nói; ghét nhất ai chép đáp án trên khung chat.
//  - Câu cửa miệng: "cho 10 điểm, khỏi cảm ơn", "sai mà tự tin quá, cô nể", "trừ lương... à nhầm, trừ điểm".
// =====================================================

type L0 = string[];
type L1 = ((a: string) => string)[];
type L2 = ((a: string, b: string) => string)[];
type L3 = ((a: string, b: string, c: string) => string)[];

// Quà cô thưởng: cô nói tên quà, món quà bay xuống đặt lên bàn (hình icon)
export const REWARDS = [
  { name: 'một ly trà sữa full topping', icon: '🧋' },
  { name: 'một ly cà phê muối', icon: '☕' },
  { name: 'một voucher freeship', icon: '🎟️' },
  { name: 'một gói mì tôm cứu đói cuối tháng', icon: '🍜' },
  { name: 'một cây kẹo mút cho đỡ áp lực', icon: '🍭' },
  { name: 'một cái bánh tráng trộn', icon: '🥟' },
  { name: 'một miếng bánh kem', icon: '🍰' },
  { name: 'một điểm mười đỏ chót', icon: '💯' },
  { name: 'một ngôi sao lấp lánh', icon: '🌟' },
  { name: 'một cái ôm từ xa của cô', icon: '🤗' },
  { name: 'một ngày nghỉ phép tưởng tượng', icon: '🏖️' },
  { name: 'một tấm bằng khen tự in', icon: '📜' },
  { name: 'một chú gấu bông', icon: '🧸' },
  { name: 'một chiếc vương miện giấy', icon: '👑' },
];

export const LINES = {
  // ---------- Vào tiết ----------
  intro: [
    'Cả lớp ổn định nào! Cô Ngân vào lớp rồi đây. Ai gõ đáp án nhanh nhất thì nhiều điểm nhất, chép bài là cô biết hết nha.',
    'Tiết mới tới rồi. Hai mươi câu, câu cuối nhân đôi điểm. Ai đang trốn việc thì trốn cho đàng hoàng, vào học với cô.',
    'Cất điện thoại đi... à quên, lớp mình học bằng điện thoại. Thôi vào bài luôn cho nhanh.',
    'Chào cả lớp! Hôm nay cô hỏi khó hơn hôm qua một chút, vì hôm qua cả lớp làm cô tự ái.',
    'Vào học! Đúng nhanh nhất được mười điểm, chậm thì ít hơn, chép đáp án trên khung chat thì được đúng một điểm cho có.',
    'Tiết này có đủ món: toán, tiếng Anh, lịch sử, đố mẹo, đuổi hình bắt chữ. Như buffet vậy đó, ăn đi đừng ngại.',
    'Lớp trưởng đâu, hô cả lớp đứng dậy coi. Thôi khỏi, ai cũng mệt rồi, ngồi luôn đi vào câu một.',
    'Ai ngủ gật thì dậy, ai đang họp online thì tắt mic đi. Vào tiết mới, điểm làm lại từ đầu.',
    'Hôm nay cô vui vì sắp có lương. Nên tiết này cô dễ tính... được khoảng năm phút.',
    'Bàn đầu đang trống kìa. Ai giỏi thì lên ngồi, ai lười thì xuống cuối lớp ngồi với cô cho vui.',
    'Tổ nào trả lời giỏi thì tổ đó thắng nha. Thua thì tổ đó bao cô trà sữa, cô đùa đó... chắc vậy.',
    'Cả lớp chú ý lên bảng. Cô xáo chữ lung tung giống cuộc đời cô cuối tháng vậy, việc của các bạn là xếp lại cho đúng.',
  ] as L0,

  goldenIntro: [
    'Câu cuối rồi! Câu hỏi vàng, điểm nhân đôi. Ai đang thua thì lật kèo ở câu này, ai đang thắng thì run đi là vừa.',
    'Câu hỏi vàng tới đây! Đúng câu này điểm gấp đôi, bảng xếp hạng đảo lộn như giá vàng luôn.',
    'Tập trung nha, câu cuối nhân đôi điểm. Ngồi bàn đầu mà sai câu này là mất ghế như mất lương.',
    'Câu hỏi vàng! Cô hồi hộp hơn cả lúc chờ lương về.',
    'Câu cuối, nhân đôi điểm. Gõ nhanh nhưng nhớ gõ đủ dấu, sai dấu cô không thương đâu.',
  ] as L0,

  // đọc đề xong cô hô bắt đầu tính giờ
  go: [
    'Bắt đầu!',
    'Tính giờ! Bắt đầu!',
    'Đồng hồ chạy rồi, bắt đầu!',
    'Ba, hai, một, bắt đầu!',
    'Gõ đi cả lớp, bắt đầu!',
    'Bấm giờ nè, bắt đầu!',
    'Chạy deadline nào, bắt đầu!',
  ] as L0,

  // còn 5 giây
  // còn 5 giây: chỉ nhắc sắp hết giờ, ngắn gọn, không đùa thêm (chủ kênh chốt 2026-11-05)
  timeWarn: [
    'Sắp hết giờ rồi!',
    'Sắp hết giờ nha cả lớp!',
    'Chuẩn bị hết giờ!',
    'Sắp hết giờ, nhanh lên nào!',
  ] as L0,

  // mời bạn trả lời chưa đúng lên đứng cạnh cô làm đội cổ vũ / trợ giảng vui vẻ
  roastStand: [
    (n) => `${n} xém chút nữa là đúng rồi! Lên đứng cạnh cô làm trợ giảng cổ vũ cả lớp mấy câu nha!`,
    (n) => `Ối ${n} trượt tay chút xíu! Lên bục đứng cạnh cô tiếp năng lượng cho cả lớp nha.`,
    (n) => `Cô mời ${n} lên đứng cạnh cô làm đội cổ vũ đặc biệt một lát nha. Câu sau gỡ lại liền!`,
    (n) => `${n} ơi, lên đứng cạnh bảng phụ cô cổ vũ cả lớp vài câu cho vui nha!`,
  ] as L1,
  // gọi bạn ngủ gật (ngồi im lâu) dậy
  wakeUp: [
    (n) => `Ơ kìa ${n} đang nghỉ giải lao hả? Dậy chơi tiếp với cô nào!`,
    (n) => `${n} ơi, cô pha trà sữa rồi nè, dậy đoán chữ tiếp với cả lớp nha.`,
    (n) => `Cả lớp vẫy tay gọi ${n} dậy chơi tiếp với cô nào! Chắc tối qua chạy dự án chăm chỉ quá.`,
  ] as L1,

  // ---------- Thỉnh thoảng rủ tương tác (lúc đang chờ trả lời) ----------
  loveCall: [
    'Ai yêu cô thì gõ số một nào, cả lớp ơi!',
    'Ai thương cô Ngân thì gõ số một cho cô có động lực sống tới cuối tháng nha!',
    'Ai đang học với cô thì gõ số một nào, cô đếm đó!',
    'Ai thấy cô hôm nay xinh thì gõ số một nha. Ai không thấy thì cũng gõ số một luôn.',
    'Cô cần chút năng lượng, cả lớp gõ số một cho cô coi nào!',
  ] as L0,
  // c = số bạn gõ, n = vài tên
  loveThanks: [
    (c, n) => `Ôi ${c} bạn yêu cô luôn, cô cảm động quá! Cảm ơn ${n} nha, còn hơn lương về.`,
    (c, n) => `${c} bạn gõ số một rồi nè! Cảm ơn ${n}, cô sạc đầy pin rồi.`,
    (c, n) => `Cô thấy rồi nha, ${n} và các bạn, tổng cộng ${c} bạn thương cô. Hôm nay khỏi cần trà sữa.`,
  ] as L2,

  // kết quả bình chọn vui: l = lựa chọn đông nhất, c = số bạn
  pollResult: [
    (l, c) => `Kết quả nè: ${l} đông nhất, ${c} bạn luôn!`,
    (l, c) => `Cô đếm rồi nha, ${l} thắng với ${c} bạn. Phe còn lại cố gắng rủ thêm đồng minh nha.`,
    (l, c) => `Ồ, ${l} áp đảo lớp mình, ${c} bạn. Cô ghi nhận.`,
  ] as L2,
  pollTie: [
    (c) => `${c} bạn trả lời mà hoà nhau luôn! Lớp mình công bằng ghê.`,
    (c) => `Hoà rồi nha, ${c} bạn chia đều hai bên. Cô không phán xử đâu, cô sợ mất lòng.`,
  ] as L1,

  // chuyện vui, chuyện lịch sử, mẹo tiếng Anh (1-2 câu) lúc đang chờ trả lời. Chỉ ghi điều chắc chắn đúng.
  // "| E: ... | F:" = đọc phần tiếng Anh bằng giọng tiếng Anh
  funFact: [
    'Cả lớp có biết không, con bạch tuộc có tới ba trái tim. Vậy mà vẫn ít hơn số lần cô bị tổn thương cuối tháng.',
    'Con ngựa có thể ngủ trong lúc đứng. Giống mấy bạn họp buổi chiều vậy đó.',
    'Cá heo ngủ mà vẫn mở một mắt để canh chừng. Kỹ năng này dân văn phòng cần học gấp.',
    'Mật ong cất kỹ để rất lâu cũng không bị hỏng. Không giống lời hứa tăng lương.',
    'Mặt trời thật ra là một ngôi sao, ở gần mình nhất nên mới to vậy. Giống deadline, càng gần càng to.',
    'Trái tim người đập khoảng một trăm nghìn lần mỗi ngày. Lúc thấy crush thì chắc gấp đôi.',
    'Văn Miếu ở Hà Nội xây từ năm một nghìn không trăm bảy mươi, tức là gần một nghìn năm rồi đó cả lớp.',
    'Chim cánh cụt không bay được nhưng bơi rất giỏi. Ai cũng có thế mạnh riêng, đừng buồn nha.',
    'Biển và đại dương chiếm khoảng bảy phần mười bề mặt Trái Đất. Ví tiền của cô thì chiếm khoảng không phần mười.',
    'Cầu vồng có bảy màu: đỏ, cam, vàng, lục, lam, chàm, tím. Ai đọc thuộc được thì cô cho mười điểm tinh thần.',
    'Mẹo tiếng Anh nè: chào buổi sáng là | E: good morning | F: còn chào sếp lúc tám giờ năm phút là im lặng đi vào chỗ.',
    'Mẹo tiếng Anh nè: hạn chót là | E: deadline | F: từ này cả lớp ai cũng thuộc rồi đúng không.',
    'Mẹo tiếng Anh nè: tăng lương là | E: salary increase | F: học để dành, biết đâu có ngày dùng.',
    'Mẹo tiếng Anh nè: làm thêm giờ là | E: overtime | F: hay gọi tắt là OT, nghe quen quá trời.',
    'Mẹo tiếng Anh nè: cuối tuần là | E: weekend | F: từ đẹp nhất trong tiếng Anh theo cô.',
    'Mẹo tiếng Anh nè: tôi đói rồi là | E: I am hungry | F: câu cô nói nhiều nhất lúc bốn giờ chiều.',
    'Mẹo tiếng Anh nè: chúc ngủ ngon là | E: good night | F: nói với crush thử đi, nói với sếp thì thôi.',
    'Mẹo tiếng Anh nè: để mai tính là | E: let me think about it | F: câu này dùng khi bị rủ đi họp lớp.',
  ] as L0,

  // ---------- Lớp vắng: ôn bài bằng câu cũ ----------
  reviewIntro: [
    'Lớp vắng quá, cô cho ôn bài cũ nha. Ai vào lớp thì gõ chào cô một tiếng, cô ra bài mới liền.',
    'Giờ ôn bài nè. Cô hỏi lại mấy câu cũ, ai đang lướt ngang thì trả lời thử coi còn nhớ không.',
    'Tiết này ôn bài. Ai vào thì gõ vào lớp, cô chuyển sang bài mới, hứa không thù dai.',
  ] as L0,
  reviewEnd: [
    'A, có người vào lớp rồi! Hết ôn bài, cô ra câu mới nha.',
    'Lớp đông lên rồi nè. Ôn bài vậy đủ, giờ học bài mới cho máu.',
    'Có bạn rồi! Cô tưởng phải dạy một mình tới sáng chứ.',
  ] as L0,

  // ---------- Chào theo giờ trong ngày (đọc đầu tiết) ----------
  // chào buổi sáng: chỉ chào + nhắc ăn sáng rồi hãy đi làm (chủ kênh 2026-11-05: không rủ người đang đi đường, kẹt xe chơi)
  timeMorning: [
    'Chào buổi sáng cả lớp! Nhớ ăn sáng đầy đủ rồi hãy đi làm nha.',
    'Buổi sáng tốt lành cả lớp! Ăn sáng chưa đó? Ăn no rồi mới đi làm nha.',
    'Chào buổi sáng! Cả lớp nhớ ăn sáng, uống ly nước rồi hãy đi làm, đừng để bụng đói nha.',
  ] as L0,
  timeNoon: [
    'Trưa rồi cả lớp ơi, ăn cơm văn phòng chưa? Hôm nay ăn gì, đừng nói là mì gói nha.',
    'Giờ nghỉ trưa nè. Ai đang tranh thủ mười lăm phút trước khi ngủ trưa thì chơi với cô một tiết.',
    'Trưa nắng quá, cả lớp ở trong phòng máy lạnh học với cô cho mát nè.',
  ] as L0,
  timeAfternoon: [
    'Chào buổi chiều cả lớp! Ai đang ngồi chờ tới giờ tan làm thì giơ tay.',
    'Buổi chiều là lúc buồn ngủ nhất, cô hỏi vài câu cho tỉnh nha.',
    'Ba bốn giờ chiều rồi, ai đang thèm trà sữa giống cô thì gõ số một.',
  ] as L0,
  timeEvening: [
    'Chào buổi tối cả lớp! Tan làm rồi, giờ là giờ của mình, chơi với cô nha.',
    'Tối rồi, ăn cơm xong nằm lướt TikTok đúng không? Gặp cô rồi thì ở lại học một tiết đi.',
    'Buổi tối lớp mình đông vui quá. Tiết này ai làm lớp trưởng đây?',
  ] as L0,
  timeNight: [
    'Khuya rồi cả lớp ơi. Ai còn thức thì chắc đang chạy deadline, cô ngồi học cùng cho đỡ buồn.',
    'Đã khuya rồi đó. Chơi thêm một tiết rồi đi ngủ nha, mai còn đi làm.',
    'Giờ này còn thức là chưa xong việc, hoặc đang nhắn tin với ai đó. Cô hỏi thôi, không nói ai.',
  ] as L0,

  // ---------- Cô nhận hoa (bạn nhỏ lên bục đưa): cảm ơn theo bậc (n tên, g = "một bông hoa" / "một bó hoa nhỏ"...) ----------
  // ---------- Nút "Chào tạm biệt" (chủ kênh bấm trước khi xuống live) ----------
  goodbye: [
    'Tùng tùng tùng! Trống tan trường điểm rồi cả lớp ơi! Cất sách vở vào cặp về ăn ngon ngủ kỹ nha. Nhớ bấm Follow kênh và bật chuông ngay để lần sau nhận thông báo vào lớp đúng giờ nha!',
    'Tan lớp rồi cả lớp ơi! Chúc cả lớp tối ngủ ngon không mơ thấy deadline, mai lương về ngập ví. Ai chưa Follow thì bấm Follow kênh liền tay để lần sau cô mở cửa lớp là nhận được thông báo vào học ngay nha!',
    'Hết giờ học rồi! Cô xin phép đi uống trà sữa full topping đây. Cả lớp nhớ bấm nút Follow kênh ở góc trên màn hình để lần sau nhận thông báo vào lớp sớm, xí chỗ ngồi bàn đầu nha. Bye bye cả lớp!',
    'Trống trường đã điểm, lễ bế giảng hôm nay kết thúc tại đây! Cô thương cả lớp nhiều lắm, về nghỉ ngơi sạc đầy pin, nhớ bấm Follow kênh để lần sau nhận thông báo vào lớp thi đua tiếp nha. Tạm biệt cả lớp!',
    'Tan học thôi nào các thần đồng của cô ơi! Hôm nay ai cũng giỏi, cô cho cả lớp mười điểm tinh thần hết. Đừng quên bấm Follow kênh để lần sau máy báo chuông vào lớp ngay khi cô lên live nha!',
  ] as L0,
  // có bạn dẫn đầu tiết đang học thì cô nhắc tên
  goodbyeTop: [
    (n) => `Tùng tùng tùng! Trống tan trường rồi cả lớp ơi! Hôm nay cô đặc biệt tuyên dương ${n} đã xuất sắc dẫn đầu lớp mình! Cả lớp nhớ bấm Follow kênh ngay để lần sau nhận thông báo vào lớp sớm và phục thù nha!`,
    (n) => `Tan lớp thôi nào! Cả lớp nổ một tràng pháo tay thật to cho quán quân hôm nay là ${n} nha! Chúc mọi người ngủ ngon không gặp deadline, nhớ bấm Follow kênh để lần sau nhận thông báo vào lớp ngay khi cô mở live nha!`,
    (n) => `Cô xin phép đóng cửa lớp nghỉ ngơi đây! Hôm nay ${n} học đỉnh quá trời, ngồi vững ghế đầu luôn. Các bạn nhớ bấm Follow kênh và bật chuông để lần sau nhận thông báo vào lớp sớm giành lại chức lớp trưởng nha. Bye bye cả lớp!`,
  ] as L1,
  // ---------- Lời đáp riêng cho quà trong bảng "Gửi tặng cô" (chủ kênh 2026-11-05), n = tên ----------
  thankHeart: [
    (n) => `Uii, ${n} bắn trúng tim cô rồi! Cô thương ${n} nhiều lắm nha.`,
    (n) => `Á, trúng tim cô rồi ${n} ơi! Cô bắn lại một trái tim to đùng cho ${n} nè.`,
    (n) => `${n} bắn tim cô kìa! Tim cô rung rinh luôn, cảm ơn ${n} nha.`,
    (n) => `Ôi trái tim của ${n} bay tới rồi! Chúc ${n} hôm nay làm gì cũng suôn sẻ nha.`,
    (n) => `Trúng phóc tim cô luôn! Cô gửi lại ${n} ngàn trái tim, chúc ${n} một ngày thật vui.`,
    (n) => `${n} bắn tim là cô hết mệt liền. Cô thương ${n}, chúc ${n} ăn ngon ngủ kỹ nha.`,
    (n) => `Uầy, ${n} bắn tim cô! Cô xin nhận và trả lại gấp đôi, chúc ${n} gặp toàn chuyện may mắn.`,
  ] as L1,
  thankRose: [
    (n) => `${n} tặng cô bông hồng xinh quá! Cô cảm ơn nha, chúc ${n} hôm nay thật nhiều niềm vui.`,
    (n) => `Ôi bông hồng của ${n} thơm ghê! Cô cắm vào bình liền, chúc ${n} luôn tươi như hoa nha.`,
    (n) => `Cảm ơn ${n} nha, bông hồng này cô giữ kỹ lắm. Chúc ${n} một ngày suôn sẻ.`,
    (n) => `${n} ơi cô cảm động quá! Chúc ${n} lúc nào cũng xinh tươi như bông hồng này.`,
    (n) => `Có bông hồng của ${n} là cô dạy hăng hơn hẳn. Cảm ơn ${n}, chúc ${n} bình an nha.`,
  ] as L1,
  thankDonut: [
    (n) => `Oa, ${n} mời cô ăn bánh donut! Ngọt như tấm lòng của ${n} vậy, cô cảm ơn nha.`,
    (n) => `Bánh donut của ${n} nè! Cô ăn một miếng, chia cả lớp một miếng. Chúc ${n} ngày nào cũng ngọt ngào.`,
    (n) => `Cảm ơn ${n} mời cô bánh nha! Đúng lúc cô đang đói, chúc ${n} ăn gì cũng ngon.`,
    (n) => `${n} chiều cô quá trời! Bánh donut tròn tròn, chúc ${n} mọi việc tròn trịa luôn nha.`,
    (n) => `Ui bánh donut! ${n} biết cô thích đồ ngọt ghê. Cô cảm ơn, chúc ${n} một ngày thật ngọt.`,
  ] as L1,
  thankTier0: [
    (n, g) => `Ôi cô cảm ơn ${n} nha, ${g} xinh quá. Cô có thêm động lực dạy tới cuối tháng rồi nè.`,
    (n, g) => `${n} tặng cô ${g}! Hôm nay cô không than lương nữa.`,
    (n, g) => `Cảm ơn ${n} nha, cô giữ ${g} này thật kỹ, không cho thầy thể dục coi đâu.`,
  ] as L2,
  thankTier1: [
    (n, g) => `Oa, ${n} tặng cô ${g} luôn! Cô cảm ơn nhiều lắm nha.`,
    (n, g) => `${g} đẹp quá ${n} ơi! Cô vui cả buổi luôn đó.`,
  ] as L2,
  thankTier2: [
    (n, g) => `Trời ơi ${n} tặng cô ${g}! Cô cảm động quá, cả lớp vỗ tay cho ${n} nào!`,
    (n, g) => `${g} luôn hả ${n}? Cô cảm ơn nhiều lắm lắm, hôm nay cô là cô giáo hạnh phúc nhất.`,
  ] as L2,
  thankTier3: [
    (n, g) => `Không tin nổi, ${n} tặng cô ${g}! Cô cảm ơn từ tận đáy lòng, cả lớp hoan hô ${n} nào!`,
    (n, g) => `${n} ơi, ${g} lận! Lớp mình có nhà tài trợ lớn rồi. Cô cảm ơn thật lòng!`,
  ] as L2,
  // quỹ lớp đạt mốc (g = số bông hoa)
  fundGoal: [
    (g) => `Quỹ lớp mình hôm nay đủ ${g} bông hoa rồi! Cô cảm ơn tấm lòng của cả lớp nhiều lắm, có các bạn cô dạy vui quá.`,
    (g) => `Quỹ lớp đã đủ ${g} bông hoa! Cô trân trọng từng bông một. Cảm ơn cả lớp nha!`,
  ] as L1,

  // ---------- Học bạ: lên lớp (g = "lớp 3" / "tốt nghiệp"), huy hiệu mới (b = "🧮 Thần đồng toán") ----------
  gradeUp: [
    (n, g) => `Chúc mừng ${n} đã lên ${g}! Cả lớp vỗ tay nào, lên lớp còn nhanh hơn lên lương.`,
    (n, g) => `${n} học giỏi quá, lên ${g} rồi đó! Cô tặng mũ tốt nghiệp nè.`,
    (n, g) => `${n} vừa lên ${g}! Chăm chỉ là có thăng chức, ít ra là ở lớp cô.`,
  ] as L2,
  badgeNew: [
    (n, b) => `${n} vừa nhận huy hiệu ${b}! Ghi vào hồ sơ xin việc được luôn đó.`,
    (n, b) => `Huy hiệu mới cho ${n} nè: ${b}. Cả lớp vỗ tay!`,
  ] as L2,

  // ---------- Chúc mừng sinh nhật (gõ "hôm nay sinh nhật mình") ----------
  birthday: [
    (n) => `Ôi hôm nay sinh nhật ${n}! Cả lớp cùng chúc mừng sinh nhật nào! Cô tặng một cái bánh kem nè.`,
    (n) => `Chúc mừng sinh nhật ${n}! Chúc tuổi mới tăng lương, giảm cân, hết deadline. Cả lớp vỗ tay nào!`,
    (n) => `Hôm nay là ngày đặc biệt của ${n} nè! Chúc tuổi mới thật vui, có người yêu thương. Bánh kem đây!`,
    (n) => `Cả lớp ơi, ${n} sinh nhật kìa! Mình cùng hát mừng sinh nhật nha. Cô đặt bánh kem lên bàn rồi đó.`,
    (n) => `Sinh nhật vui vẻ nha ${n}! Tuổi mới trả lời câu nào cũng đúng, gặp sếp nào cũng hiền.`,
  ] as L1,

  // ---------- Chuyên cần: đi học nhiều ngày liền (d = số ngày) ----------
  attendBack: [
    (n, d) => `A, ${n} lại vào lớp nè! Đi học ${d} ngày liền rồi, chuyên cần hơn cả đi làm.`,
    (n, d) => `Cô nhớ ${n} nha, hôm qua cũng có mặt. ${d} ngày liền rồi đó.`,
    (n, d) => `${n} quay lại rồi! ${d} ngày liền, cô cảm động ghê.`,
    (n, d) => `Chào ${n}, ngày thứ ${d} liền vào lớp rồi. Lớp mình có fan cứng rồi nè.`,
  ] as L2,
  // n tên, d số ngày, g quà
  attendMilestone: [
    (n, d, g) => `Cả lớp ơi, ${n} đi học ${d} ngày liền không nghỉ buổi nào! Cô tặng ${g} vì chuyên cần.`,
    (n, d, g) => `Học sinh chuyên cần nhất lớp đây rồi: ${n}, ${d} ngày liền! Phần thưởng là ${g}.`,
    (n, d, g) => `${d} ngày liền có mặt, ${n} đỉnh quá! Cô thưởng ${g}, cả lớp học tập nha.`,
  ] as L3,

  // ---------- Chủ kênh bấm "Bỏ câu này" ----------
  banned: [
    'Ối, câu này cô ra chưa hay, mình bỏ qua nha. Coi như cô chưa nói gì.',
    'Câu này cô đổi nha, sang câu khác liền.',
    'Thôi câu này bỏ, cô ra câu khác xịn hơn nè.',
  ] as L0,

  // ---------- Cả lớp chọn chủ đề tiết sau (a, b = 2 chủ đề) ----------
  voteIntro: [
    (a, b) => `Tiết sau học gì đây cả lớp? Gõ số một nếu chọn ${a}, gõ số hai nếu chọn ${b}.`,
    (a, b) => `Cả lớp quyết định nha! Một là ${a}, hai là ${b}. Dân chủ như họp công ty, nhưng ở đây phiếu của các bạn có giá trị thật.`,
    (a, b) => `Cô cho các bạn chọn chủ đề tiết sau: một, ${a}. Hai, ${b}. Bên nào nhiều phiếu hơn thì học bên đó.`,
  ] as L2,
  voteResult: [
    (t) => `Cả lớp đã chọn rồi! Tiết này mình học chủ đề ${t} nha.`,
    (t) => `Chủ đề ${t} thắng rồi! Cô ra nhiều câu về ${t} cho các bạn nè.`,
    (t) => `Theo ý cả lớp, tiết này có nhiều câu về ${t}. Chuẩn bị nha!`,
  ] as L1,
  voteNobody: [
    'Chưa ai chọn hết, vậy cô tự chọn câu hỏi nha.',
    'Không ai bình chọn hả? Thôi cô trộn đủ chủ đề luôn, ai than thì tiết sau nhớ bầu.',
  ] as L0,

  // ---------- Chia tổ (bản riêng cô Ngân): 45 giây chọn tổ trước mỗi tiết ----------
  teamIntro: [
    'Trước khi vào học, cô Ngân chia lớp làm bốn tổ nha. Gõ tổ một, tổ hai, tổ ba hoặc tổ bốn vào bình luận. Ai không chọn thì cô xếp cho.',
    'Chọn tổ nào cả lớp! Có bốn tổ, gõ tổ một, tổ hai, tổ ba hay tổ bốn đều được. Ai chưa chọn cô Ngân xếp giùm luôn.',
    'Giờ thi đua tổ nè! Muốn vào tổ nào thì gõ tổ và số tổ, ví dụ tổ ba. Bốn mươi lăm giây thôi nha.',
  ] as L0,
  teamRemind: [
    (a) => `Còn mười lăm giây chọn tổ nha cả lớp. ${a}`,
    (a) => `Sắp hết giờ chọn tổ rồi! ${a} Ai chưa chọn thì gõ lẹ lên.`,
    (a) => `Nhanh tay chọn tổ nào! ${a}`,
  ] as L1,
  teamClose: [
    (a, b) => `Hết giờ chọn tổ! ${a} ${b} Thi đua thôi cả lớp ơi!`,
    (a, b) => `Cô Ngân chốt danh sách tổ nha. ${a} ${b} Tổ nào nhiều điểm nhất thì thắng tiết này.`,
    (a, b) => `Xong rồi! ${a} ${b} Cả tổ cùng cố gắng, đừng để đồng đội gánh team.`,
  ] as L2,
  teamWin: [
    (t, s) => `Tổ thắng tiết này là ${t}, được ${s} điểm. Cả tổ giỏi quá, cô Ngân tặng cờ thi đua!`,
    (t, s) => `Thi đua tổ: ${t} về nhất với ${s} điểm. Vỗ tay cho ${t} nào!`,
    (t, s) => `${t} thắng rồi, ${s} điểm! Các tổ khác tiết sau giành lại cờ nha.`,
  ] as L2,
  teamNobody: [
    'Tiết này chưa tổ nào có điểm hết, tiết sau cố lên nha.',
    'Bốn tổ đều chưa ghi điểm. Cô buồn như thứ hai đầu tuần.',
  ] as L0,

  // ---------- 2 game lớn (bản riêng): Đường lên đỉnh Everest, Rung Chuông Đồng ----------
  // báo trước ở đầu tiết: hết tiết này là tới game lớn (g = tên game)
  showSoon: [
    (g) => `Thông báo nè cả lớp: hết tiết này là tới ${g} nha! Học cho tốt, lát nữa thi cho đã.`,
    (g) => `Các bạn ơi, học xong tiết này mình chơi ${g}. Ai chưa follow thì follow kênh để không lỡ nha.`,
    (g) => `Chuẩn bị tinh thần đi các bạn, cuối tiết này là ${g}, câu hỏi khó hơn bình thường đó!`,
  ] as L1,
  showIntroEverest: [
    'Cả lớp ơi, hôm nay mình không ra chơi, mình đi leo núi! Chào mừng tới Đường lên đỉnh Everest. Gõ A, B, C hoặc D, ai đúng cũng được điểm, không cần nhanh, cần đúng. Đội leo núi tập hợp nha!',
    'Đổi gió chút nha các bạn. Cô Ngân mặc đồ leo núi rồi nè, mình chơi Đường lên đỉnh Everest. Mỗi câu gõ một chữ A, B, C hoặc D, gõ một lần thôi. Ai tới đỉnh trước, cô cắm cờ cho!',
    'Đường lên đỉnh Everest bắt đầu! Câu hỏi khó hơn bình thường một chút, trả lời đúng là leo cao thêm. Mỗi bạn một đáp án mỗi câu, gõ hai lần cô chỉ tính lần đầu nha.',
  ] as L0,
  showIntroChuong: [
    'Giờ ra chơi hôm nay đặc biệt nè, cả lớp cùng chơi Rung Chuông Đồng! Gõ A, B, C hoặc D, ai đúng cũng có điểm, sai không bị loại. Người điểm cao nhất được cầm chuông của cô Ngân!',
    'Rung Chuông Đồng đây các bạn ơi! Mỗi câu gõ một đáp án A, B, C hoặc D. Không ai bị loại hết, cứ chơi tới cuối là có cơ hội rung chuông.',
    'Cô Ngân đã cầm chuông lên rồi nè. Rung Chuông Đồng bắt đầu, câu hỏi khó hơn tiết học một chút, mỗi bạn chỉ được trả lời một lần mỗi câu thôi nha.',
  ] as L0,
  evWarm: [
    'Chặng một, Bước chân đầu tiên. Bốn câu khởi động, mỗi câu tám giây, đúng được mười điểm.',
    'Bước chân đầu tiên nè các bạn, bốn câu dễ thở, đúng là leo lên mười điểm.',
  ] as L0,
  evCode: [
    'Chặng hai, Mật mã trạm. Cô đọc ba gợi ý, đoán ra ở gợi ý đầu được ba mươi điểm, gợi ý hai hai mươi, gợi ý ba mười điểm. Gõ thẳng từ khoá vào bình luận, có dấu nha.',
    'Tới trạm nghỉ rồi, phải giải mật mã mới được đi tiếp. Ba gợi ý, đoán càng sớm điểm càng cao. Mỗi gợi ý mỗi bạn đoán một lần.',
  ] as L0,
  evStorm: [
    'Chặng ba, Bão tốc độ! Bốn câu, mỗi câu tám giây, đúng được mười lăm điểm. Bám chặt dây leo nha.',
    'Bão tới rồi các bạn ơi! Bốn câu chớp nhoáng, mười lăm điểm mỗi câu, ai lơ mơ là bị gió thổi xuống chân núi.',
  ] as L0,
  evPeak: [
    'Chặng cuối, Chạm đỉnh! Trước mỗi câu các bạn chọn mức điểm, gõ mười hoặc hai mươi. Đúng thì cộng đúng mức đã chọn, sai không bị trừ. Ai không chọn cô tính mười.',
    'Sắp tới đỉnh rồi! Ba câu cuối, chọn mức cược trước khi xem câu: gõ mười hoặc hai mươi. Liều thì ăn nhiều nha.',
  ] as L0,
  evStake: [
    'Chọn mức điểm cho câu tiếp theo nè, gõ mười hoặc hai mươi.',
    'Cược bao nhiêu đây các bạn? Gõ mười hay hai mươi.',
    'Liều ăn nhiều, gõ hai mươi. Chắc ăn thì gõ mười.',
  ] as L0,
  chWarm: [
    'Phần một, Làm nóng. Bốn câu, mỗi câu tám giây, đúng được mười điểm.',
    'Khởi động nha cả lớp, bốn câu làm nóng, mười điểm mỗi câu.',
  ] as L0,
  chHold: [
    'Phần hai, Trụ vững. Sáu câu kiến thức phổ thông, mỗi câu mười giây, đúng được mười điểm.',
    'Giờ là Trụ vững nè, sáu câu liên tiếp. Bình tĩnh, đọc kỹ đáp án rồi hãy gõ.',
  ] as L0,
  chRescue: [
    'Câu Cứu trợ cả phòng! Câu này không có điểm, nhưng ai đúng được một phiếu gợi ý. Tới Thử thách cuối, gõ "gợi ý" là cô bỏ hai đáp án sai cho cả phòng.',
    'Cứu trợ nè các bạn. Đúng câu này được phiếu gợi ý, lát nữa dùng để tiếp sức cho cả lớp ở câu khó.',
  ] as L0,
  chFinal: [
    'Phần ba, Thử thách cuối. Ba câu khó, mỗi câu mười lăm giây, đúng được hai mươi điểm. Ai có phiếu thì gõ "gợi ý" nha.',
    'Thử thách cuối tới rồi, hai mươi điểm mỗi câu. Bạn nào có phiếu gợi ý thì cứu cả lớp đi.',
  ] as L0,
  chBell: [
    'Và đây là Câu Chuông Đồng, ba mươi điểm! Ai đúng câu này được rung chuông cùng cô Ngân.',
    'Câu Chuông Đồng, câu quyết định, ba mươi điểm. Hít thở sâu nha các bạn.',
  ] as L0,
  showGo: [
    'Bắt đầu!',
    'Gõ đáp án đi nào!',
    'Chọn đi các bạn!',
    'Mời cả lớp!',
  ] as L0,
  showReveal: [
    (a, n) => `Đáp án là ${a}. Có ${n} bạn đúng, giỏi quá!`,
    (a, n) => `Đáp án đúng: ${a}. ${n} bạn trả lời đúng rồi nè.`,
    (a, n) => `${a} mới là đáp án nha. ${n} bạn đúng, cô thương.`,
  ] as L2,
  showNobody: [
    (a) => `Đáp án là ${a}. Không ai đúng hết, câu này cô lừa được cả lớp rồi.`,
    (a) => `Không bạn nào đúng luôn. Đáp án là ${a}, ghi vào sổ tay nha.`,
  ] as L1,
  codeIntro: [
    (n) => `Mật mã gồm ${n} chữ cái. Nghe gợi ý một nè.`,
    (n) => `Từ khoá có ${n} chữ cái, cô đọc gợi ý đầu tiên.`,
  ] as L1,
  codeRescue: [
    (f, n) => `Chưa ai giải được, cô mở cứu trợ mười giây! Mật mã bắt đầu bằng chữ ${f}, gồm ${n} chữ cái.`,
    (f, n) => `Cứu trợ cả phòng nè! Chữ đầu là ${f}, có ${n} chữ cái. Giải được là người dẫn đường đó.`,
  ] as L2,
  codeReveal: [
    (a, n, x) => `Mật mã là ${a}! ${n} bạn giải được, nhanh nhất có ${x}.`,
    (a, n, x) => `Từ khoá là ${a}. Cô khen ${x}, tổng cộng ${n} bạn mở được trạm.`,
  ] as L3,
  codeNobody: [
    (a) => `Mật mã là ${a}. Không ai giải được, cả đoàn ngồi nghỉ ở trạm thêm chút.`,
    (a) => `Đáp án là ${a} nha. Khó quá ha, cô cũng thấy khó.`,
  ] as L1,
  ticketWin: [
    (n) => `${n} bạn nhận được phiếu gợi ý. Nhớ gõ "gợi ý" ở Thử thách cuối nha.`,
    (n) => `Có ${n} bạn được phiếu tiếp sức rồi, để dành cho câu khó.`,
  ] as L1,
  ticketUse: [
    (x) => `${x} dùng phiếu gợi ý! Cô bỏ hai đáp án sai cho cả phòng.`,
    (x) => `Cảm ơn ${x} tiếp sức, hai đáp án sai biến mất rồi nè.`,
  ] as L1,
  bellRing: [
    (n) => `${n} bạn trả lời đúng Câu Chuông Đồng, cô Ngân rung chuông cho các bạn nè!`,
    (n) => `Leng keng! ${n} bạn đủ điều kiện rung chuông rồi!`,
  ] as L1,
  showTie: [
    (x, s) => `Ồ, ${x} đang đồng điểm ${s}. Câu phụ phân định nè, chỉ các bạn đồng điểm trả lời thôi.`,
    (x, s) => `Hoà điểm rồi! ${x} cùng ${s} điểm, cô ra một câu phụ nha.`,
  ] as L2,
  honorEverest: [
    (x, s) => `Người chạm đỉnh Everest hôm nay là ${x} với ${s} điểm! Cô cắm cờ trên đỉnh cho bạn nè. Top mười vào Đội leo núi!`,
    (x, s) => `Cờ đã cắm trên đỉnh! Chúc mừng ${x}, ${s} điểm. Cả lớp vỗ tay cho Đội leo núi nào!`,
  ] as L2,
  honorChuong: [
    (x, s) => `Người giữ chuông hôm nay là ${x} với ${s} điểm! Cô trao chuông đồng nè, leng keng!`,
    (x, s) => `Chúc mừng ${x}, ${s} điểm, rung chuông thôi! Top mười nhận huy hiệu Người chơi bền bỉ.`,
  ] as L2,
  honorNobody: [
    (g) => `${g} kết thúc rồi mà chưa ai có điểm. Lần sau cả lớp cùng chơi với cô nha.`,
    (g) => `Hết ${g} rồi, lần này chưa ai ghi điểm, lần sau cô đợi.`,
  ] as L1,
  honorThanks: [
    (n) => `Cảm ơn ${n} bạn đã chơi cùng cô.`,
    (n) => `Hôm nay có ${n} bạn tham gia, cô vui lắm.`,
  ] as L1,

  // ---------- Câu đố mẹo (câu 7, 13) ----------
  // mở màn tiết mục đố mẹo giữa tiết (2 câu liền, câu 11 và 12): cô dẫn hài trước câu đầu
  riddleSegment: [
    'Tới phần đố mẹo rồi cả lớp ơi! Hai câu liền nhau, vẫn tính điểm như thường, nghĩ thẳng là trật, nghĩ xéo mới trúng.',
    'Tới giờ cô thử tài suy luận của cả lớp rồi nha! Hai câu đố mẹo, vẫn chấm điểm, đáp án cực kỳ bất ngờ.',
    'Lương chưa về thì cô đố mẹo cho vui! Hai câu liền, điểm vẫn tính đủ, xem ai tỉnh táo nhất lớp nào.',
    'Phần xoắn não bắt đầu! Hai câu đố mẹo, đọc kỹ từng chữ trên bảng nha cả lớp.',
    'Chuẩn bị tinh thần nha cả lớp, cô sắp ra hai câu đố mẹo siêu thú vị, đoán trúng là đỉnh luôn!',
    'Hai câu đố mẹo liền nhau đây! Ai đúng cả hai cô phong làm trạng nguyên đố mẹo của lớp.',
  ] as L0,
  // câu đố mẹo thứ hai trong tiết mục (nói ngắn, không dẫn dài)
  riddleSecond: [
    'Câu đố mẹo thứ hai, thú vị hơn nữa nha.',
    'Câu đố mẹo thứ hai nè, đọc kỹ nha.',
    'Thêm một câu đố mẹo nữa, tỉnh táo lên nào.',
  ] as L0,
  riddleReveal: [
    (answer, rest) => `Đáp án là ${answer}! Có ai bị cô lừa không, giơ tay lên coi? ${rest}`,
    (answer, rest) => `${answer} nha cả lớp! Câu đố mẹo đó, nghĩ thẳng là trật liền. ${rest}`,
    (answer, rest) => `Là ${answer} đó! Ai đoán ra thì đầu óc lanh lợi quá trời. ${rest}`,
    (answer, rest) => `Cô công bố, ${answer}! Mẹo chút xíu thôi mà. ${rest}`,
  ] as L2,
  riddleNobody: [
    (a) => `Hihi, cả lớp bị cô lừa hết rồi! Đáp án là ${a} đó.`,
    (a) => `Là ${a} nè. Câu đố mẹo mà, phải nghĩ ngược lại mới ra.`,
    (a) => `${a}! Cô thắng cả lớp một ván rồi nha, hôm nay cô vui.`,
    (a) => `Không ai ra hả? ${a} đó. Câu sau cô lừa tiếp, chuẩn bị tinh thần.`,
  ] as L1,
  riddleWrong: [
    (n) => `${n} bị cô lừa rồi, hihi. Không sao, câu đố mẹo khó lắm.`,
    (n) => `${n} trả lời nghe có lý ghê mà vẫn trúng bẫy của cô.`,
    (n) => `Ối ${n} sập bẫy rồi! Nghĩ khác đi một chút nha.`,
  ] as L1,

  // ---------- Câu tiếng Anh (câu 3, 12) ----------
  // "| E: từ | F:" = đọc từ tiếng Anh bằng giọng tiếng Anh rồi cô nói tiếp giọng mình
  englishReveal: [
    (answer, rest) => `Đáp án là | E: ${answer} | F: Cả lớp đọc theo cô nha. ${rest}`,
    (answer, rest) => `Tiếng Anh là | E: ${answer}. ${answer}! | F: Giỏi quá. ${rest}`,
    (answer, rest) => `Cô công bố, đáp án là | E: ${answer} | F: Phỏng vấn xin việc mà biết từ này là ăn điểm. ${rest}`,
    (answer, rest) => `Từ này đọc là | E: ${answer} | F: Ai nói tiếng Anh giỏi ghê. ${rest}`,
  ] as L2,
  englishNobody: [
    (a) => `Câu này hơi khó ha. Đáp án là | E: ${a} | F: Cả lớp đọc theo cô nha.`,
    (a) => `Không ai ra hả? Tiếng Anh là | E: ${a}. ${a}! | F: Lần sau nhớ nha.`,
    (a) => `Đáp án là | E: ${a} | F: Tối nay cả lớp học thêm từ vựng với cô nha.`,
  ] as L1,

  // ---------- Đuổi hình bắt chữ (emoji) ----------
  pictureReveal: [
    (answer, rest) => `Hình này là ${answer} đó cả lớp! ${rest}`,
    (answer, rest) => `Đuổi hình bắt chữ: ${answer}! Nhìn kỹ là ra liền. ${rest}`,
    (answer, rest) => `Đáp án là ${answer}. Hình ghép khéo ghê chưa, cô tự khen mình. ${rest}`,
  ] as L2,

  // ---------- Câu lịch sử (câu 9, 17) ----------
  historyReveal: [
    (answer, rest) => `Đáp án là ${answer}! Cả lớp nhớ bài lịch sử giỏi ghê. ${rest}`,
    (answer, rest) => `Là ${answer} nha cả lớp. Lịch sử nước mình hay lắm đó. ${rest}`,
    (answer, rest) => `${answer}! Ai trả lời đúng là hồi đi học không ngủ gật giờ sử. ${rest}`,
    (answer, rest) => `Cô công bố, đáp án là ${answer}. Ghi nhớ nha cả lớp. ${rest}`,
  ] as L2,

  // ---------- Câu toán nhẩm ----------
  mathIntro: [
    'Tới câu toán rồi! Ai hay tính lương thì vào việc.',
    'Đổi món nha, giờ là câu toán. Gõ số vào bình luận.',
    'Câu toán nhẩm nè. Cấm mở máy tính, cấm hỏi kế toán.',
    'Nghỉ chữ một chút, làm bài toán. Gõ số là được.',
    'Câu toán tới đây. Ai tính sai thì cuối tháng tự hiểu vì sao tiền không đủ.',
  ] as L0,
  mathBonus: [
    'Chưa ai tính ra hả? Cô cho thêm mười giây nữa nè.',
    'Bài toán khó quá ha. Thêm mười giây, nhẩm lẹ lên.',
    'Cả lớp đếm ngón tay chưa đủ hả? Cô cho thêm mười giây.',
    'Thêm mười giây nữa. Không dùng máy tính đâu nha, cô thấy hết.',
  ] as L0,
  // answer = cả phép tính, vd "36 cộng 47 bằng 83"
  mathReveal: [
    (answer, rest) => `${answer}. ${rest}`,
    (answer, rest) => `Cô công bố, ${answer}. ${rest}`,
    (answer, rest) => `Đáp án nè: ${answer}. ${rest}`,
    (answer, rest) => `${answer}, tính nhẩm còn nhanh hơn ứng dụng ngân hàng. ${rest}`,
  ] as L2,
  mathNobody: [
    (a) => `Không ai tính ra luôn hả? ${a} đó cả lớp.`,
    (a) => `${a}. Bảo sao cuối tháng ai cũng hết tiền.`,
    (a) => `${a}! Cô giáo toán mà nghe là buồn lắm đó.`,
    (a) => `${a} nha. Tối nay cả lớp ôn lại bảng cửu chương cho cô.`,
  ] as L1,
  mathWrong: [
    (n) => `${n} nhẩm lệch một chút xíu rồi! Câu toán sau gỡ lại liền nha.`,
    (n) => `${n} ơi, chắc đang bấm nhầm phím đúng không? Thử lại ở câu tiếp theo nha.`,
    (n) => `${n} cộng nhầm chút xíu thôi, cô vẫn khen tinh thần xung phong tính nhẩm nhanh!`,
    (n) => `${n} xém chút nữa là ra đúng đáp số rồi, câu sau cố lên nha.`,
  ] as L1,

  // ---------- Trong lúc hỏi ----------
  firstCorrect: [
    (n) => `Ôi nhanh ghê! ${n} đúng đầu tiên rồi. Cho mười điểm, khỏi cảm ơn.`,
    (n) => `${n} trả lời đúng! Mười điểm về tay, nhanh hơn cả lương về tài khoản.`,
    (n) => `${n} xong rồi trong khi cả lớp còn đang dò chữ. Đỉnh thật sự.`,
    (n) => `${n} nhanh như chớp. Mấy bạn còn lại tranh hạng nhì đi.`,
    (n) => `Có người đúng rồi nha! Là ${n}. Còn ai nữa không?`,
    (n) => `${n} đúng rồi! Làm việc mà nhanh vầy chắc sếp thương lắm.`,
    (n) => `Chuẩn luôn ${n}! Cô cho lên bàn đầu ngồi.`,
    (n) => `${n} lụm mười điểm. Cả lớp nhanh tay lên kẻo hết phần.`,
    (n) => `Ai cho phép ${n} giỏi vậy? Đúng rồi đó!`,
    (n) => `Trời ơi ${n}! Cô chưa kịp uống ngụm trà sữa đã có người đúng.`,
    (n) => `${n} ghi điểm đầu tiên. Ai về nhì nào?`,
    (n) => `Đúng rồi ${n}! Cô thấy có tố chất làm lớp trưởng, hoặc làm trưởng phòng.`,
    (n) => `${n} đúng rồi nè. Học giỏi, gõ nhanh, chắc còn độc thân không ta?`,
    (n) => `Hoan hô ${n}! Đầu óc nhanh nhạy ghê, chắc mới uống cà phê.`,
  ] as L1,

  // đúng trong 4 giây đầu
  superFast: [
    (n) => `Thần đồng đây rồi! ${n} vừa nghe đề đã ra luôn.`,
    (n) => `Trời ơi ${n} nhanh quá trời! Lớp mình có cao thủ rồi cả lớp ơi.`,
    (n) => `${n} nhanh như tia chớp. Gõ phím kiểu này chắc chat với crush nhiều lắm.`,
    (n) => `Cô chưa kịp chớp mắt mà ${n} đã đúng rồi. Ghê thật.`,
    (n) => `Cả lớp vỗ tay cho cao thủ ${n} nào! Phản xạ nhanh hơn cả lúc nghe sếp gọi.`,
    (n) => `${n} ăn gì mà thông minh vậy? Chia sẻ thực đơn cho cả lớp đi.`,
    (n) => `Siêu nhân ${n} xuất hiện! Mới mấy giây đã có đáp án.`,
    (n) => `Cô phục ${n} luôn đó. Nhanh vầy chắc săn sale không bao giờ hụt.`,
    // khen lố (chủ kênh 2026-11-05): "|" tách đoạn, "^" đoạn hô to hơn cho có cảm xúc
    (n) => `Ối dồi ôi! | ^${n} là thần đồng thế kỷ! | Đề vừa hiện là ra đáp án, cô xin bái phục!`,
    (n) => `Dừng lại! Dừng lại hết! | ^Thiên tài ${n} vừa xuất hiện! | Bộ Giáo dục ơi, có nhân tài ở đây nè!`,
    (n) => `Trời đất quỷ thần ơi! | ^${n} nhanh hơn cả Google! | Cô đề nghị cho ${n} tốt nghiệp luôn hôm nay!`,
    (n) => `Cả lớp ơi, | ^${n} không phải người thường! | Chắc là người ngoài hành tinh xuống học ké lớp cô!`,
    (n) => `Cô nổi da gà luôn rồi nè! | ^${n} đỉnh nóc kịch trần bay phấp phới! | Ai dạy bạn giỏi vậy, cô xin số liên lạc!`,
  ] as L1,
  // trả lời siêu nhanh câu toán: thần đồng toán học (lố)
  superFastMath: [
    (n) => `Trời ơi! | ^Thần đồng toán học ${n}! | Máy tính cầm tay còn chưa kịp bật, bạn đã ra đáp số!`,
    (n) => `Ối dồi ôi! | ^${n} là máy tính sống! | Kế toán công ty nào tuyển gấp đi, nhân tài đây!`,
    (n) => `Dừng lại! | ^Giáo sư toán học ${n} đã lên tiếng! | Cô dạy toán mười năm chưa thấy ai nhẩm nhanh vậy!`,
    (n) => `Cả lớp ơi, | ^${n} nhẩm nhanh hơn cả máy tính! | Cô đề cử ${n} đi thi toán quốc tế luôn!`,
    (n) => `Trời đất ơi! | ^Bộ não siêu máy tính ${n}! | Bảng cửu chương chắc thuộc từ trong bụng mẹ!`,
  ] as L1,
  // trả lời siêu nhanh câu tiếng Anh: vua ngôn ngữ (lố)
  superFastEnglish: [
    (n) => `Ô mai gót! | ^Vua ngôn ngữ ${n}! | Tiếng Anh nhanh như người bản xứ luôn đó cả lớp!`,
    (n) => `Trời ơi! | ^Nữ hoàng tiếng Anh, à không, vua tiếng Anh ${n}! | Cô gọi bạn là thầy được không?`,
    (n) => `Dừng lại hết! | ^${n} nói tiếng Anh như gió! | Chắc kiếp trước sinh ra ở Luân Đôn!`,
    (n) => `Ối dồi ôi! | ^Thông dịch viên ${n} đã có mặt! | Đi phỏng vấn công ty nước ngoài đậu chắc luôn!`,
    (n) => `Cả lớp ơi! | ^${n} là từ điển biết đi! | Cô mở sách còn chưa kịp, bạn đã trả lời xong!`,
  ] as L1,

  quietHalfway: [
    'Sao im re vậy cả lớp? Khó lắm hả?',
    'Lớp mình đang suy nghĩ hay đang trốn việc ở tab khác vậy?',
    'Chưa ai đúng hết. Cô hơi buồn nha, buồn như ví cuối tháng.',
    'Nhìn kỹ mấy chữ trên bảng đi, đáp án nằm ngay đó.',
    'Gõ đại một chữ đi, sai cô cũng không trừ điểm đâu.',
    'Lớp mình giỏi lắm mà, sao câu này ai cũng im?',
    'Mấy bạn bàn cuối đâu rồi, nói chuyện riêng giỏi lắm mà, trả lời đi!',
    'Còn nửa thời gian. Cô ngồi chờ mà nóng ruột như chờ tin nhắn crush.',
  ] as L0,

  bonus: [
    'Khó quá hả cả lớp? Cô mở thêm một chữ, cho thêm mười giây nữa nè.',
    'Thôi được rồi, cô thương, cô mở một chữ. Mười giây nữa thôi đó.',
    'Cả lớp bí rồi. Cô cho gợi ý thêm một chữ, nhanh lên!',
    'Hết giờ mà chưa ai đúng. Cô gia hạn deadline thêm mười giây, kèm một chữ.',
    'Cô mở thêm một chữ nè. Vậy mà còn không ra thì cô đi uống trà sữa.',
    'Bí thật hả? Cô cho thêm một chữ với mười giây. Ráng lên.',
    'Lớp mình làm cô hồi hộp quá. Thêm một chữ, thêm mười giây.',
    'Gợi ý thêm một chữ nè. Nhìn kỹ là đoán ra liền đó cả lớp.',
  ] as L0,

  // ---------- Hiện đáp án ----------
  reveal: [
    (answer, rest) => `Đáp án là ${answer}. ${rest}`,
    (answer, rest) => `Chữ đúng là ${answer} nha cả lớp. ${rest}`,
    (answer, rest) => `${answer}! Đúng vậy đó. ${rest}`,
    (answer, rest) => `Cô công bố, đáp án là ${answer}. ${rest}`,
    (answer, rest) => `Câu này là ${answer}. ${rest}`,
    (answer, rest) => `Xếp lại thì thành ${answer}. ${rest}`,
  ] as L2,
  // phần "rest" của câu trên: tên người nhất câu
  revealTop: [
    (n) => `Nhất câu này là ${n}.`,
    (n) => `Người nhanh nhất là ${n}.`,
    (n) => `Mười điểm thuộc về ${n}.`,
    (n) => `${n} về nhất câu này.`,
  ] as L1,
  revealCount: [
    (c) => `Cả lớp có ${c} bạn đúng.`,
    (c) => `Tổng cộng ${c} bạn trả lời đúng.`,
    (c) => `Có ${c} bạn đúng, giỏi quá trời.`,
  ] as L1,

  revealNobody: [
    (a) => `Không ai đoán ra luôn hả? Đáp án là ${a} đó cả lớp.`,
    (a) => `Là ${a}! Câu này hơi thử thách chút xíu, câu sau cả lớp gỡ lại nha.`,
    (a) => `Đáp án là ${a}. Lớp mình nhớ từ này để lần sau gặp lại là lấy trọn điểm nha.`,
    (a) => `${a} nha cả lớp. Cùng ghi nhớ từ vựng thú vị này nha.`,
    (a) => `Cả lớp chưa ai ra. Đáp án là ${a}. Câu tiếp theo dễ thở hơn nè.`,
    (a) => `Là ${a} nha. Không sao hết, câu tiếp theo lấy lại phong độ liền.`,
    (a) => `Đáp án ${a}. Câu này cô chọn hơi hiểm hóc chút xíu.`,
    (a) => `${a}! Cả lớp để dành sức bứt phá ở câu sau nha.`,
    (a) => `Là ${a} đó. Khởi động tay gõ tiếp câu mới nào cả lớp.`,
    (a) => `Đáp án ${a}. Thôi không sao, câu sau làm lại.`,
  ] as L1,

  roastWrong: [
    (n) => `${n} gõ xém trúng rồi kìa! Câu sau gỡ lại mười điểm liền nha.`,
    (n) => `${n} trượt tay một chút xíu thôi. Cô vẫn khen tinh thần xung phong nhanh nhất lớp!`,
    (n) => `Cô thấy ${n} gõ rất nhanh nha, chỉnh lại một chữ nữa là chuẩn bài luôn.`,
    (n) => `${n} ơi, đáp án này gần giống thôi nha, câu sau lấy lại điểm liền.`,
    (n) => `${n} chưa đúng mà phong thái tự tin quá, cô tặng mười điểm tinh thần.`,
    (n) => `Cô thấy ${n} xung phong rất nhiệt tình nha. Lần sau nhìn kỹ dấu chữ hơn chút là ăn điểm.`,
    (n) => `${n} ơi, từ này hơi lạ phải không? Câu tiếp theo dễ hơn nè.`,
    (n) => `${n} chưa trúng câu này, nhưng cô thưởng điểm dũng cảm xung phong.`,
    (n) => `${n} chắc đang vừa xem live vừa canh săn sale nên gõ nhầm phím chút xíu.`,
    (n) => `Câu này ${n} đoán sáng tạo ghê! Tiếc là chưa khớp đáp án của cô.`,
    (n) => `${n} chưa đúng mà không sao, dám gõ xung phong là cô tuyên dương rồi.`,
    (n) => `${n} ơi, nhìn lại mấy chữ trên bảng chút xíu nha, xém ra rồi đó.`,
    (n) => `${n} gõ nhanh như chớp luôn, câu sau giữ tốc độ này là về nhất chắc.`,
    (n) => `Cô nhớ tên ${n} chăm phát biểu rồi nha. Câu sau cố lên lấy mười điểm!`,
    (n) => `${n} chắc đang vừa xem live vừa làm việc nên gõ nhầm một chữ.`,
    (n) => `${n} tiếc quá xém đúng rồi. Chuẩn bị câu sau gỡ lại nha.`,
  ] as L1,

  // chuỗi câu đúng liền (mốc 5, 12, 17: GAME.streakMilestones). n = tên, k = số câu liền
  streak: [
    (n, k) => `${n} đúng ${k} câu liền! Cô thưởng thêm năm điểm.`,
    (n, k) => `${n} đang lên phong độ, ${k} câu không trượt câu nào. Cộng năm điểm.`,
    (n, k) => `Chuỗi ${k} câu đúng của ${n}! Năm điểm thưởng nha.`,
    (n, k) => `${n} ${k} câu liền, KPI tháng này hoàn thành sớm. Cộng năm điểm.`,
    (n, k) => `Ai cản ${n} được không? ${k} câu liền, cộng năm điểm.`,
  ] as L2,
  // nhiều bạn cùng đủ chuỗi ở 1 câu: gộp 1 câu cho đỡ nói nhiều. n = "Minh, Lan với Hùng" / "Minh, Lan, Hùng và 2 bạn nữa"
  streakGroup: [
    (n, k) => `${n} cùng đúng ${k} câu liền! Mỗi bạn cộng năm điểm.`,
    (n, k) => `Chuỗi ${k} câu gọi tên ${n}. Năm điểm mỗi bạn nha.`,
    (n, k) => `Lớp mình nhiều cao thủ quá: ${n} ${k} câu không trượt. Cộng năm điểm hết.`,
    (n, k) => `${n} giữ phong độ ${k} câu liền, mỗi bạn năm điểm thưởng.`,
  ] as L2,
  // nói thêm sau streakGroup khi có bạn trong nhóm được cô tặng quà (quà đã đặt lên bàn)
  streakGroupGift: [
    'Vài bạn còn được cô đặt quà lên bàn nữa đó.',
    'Ai được quà thì nhìn lên bàn mình nha.',
    'Cô còn lén đặt quà lên bàn vài bạn rồi.',
  ],

  goldenWinner: [
    (n) => `${n} ăn trọn câu hỏi vàng, hai mươi điểm!`,
    (n) => `Câu hỏi vàng về tay ${n}! Nhân đôi điểm nha.`,
    (n) => `${n} lật kèo ở câu cuối. Hai mươi điểm luôn.`,
    (n) => `Người giữ câu hỏi vàng là ${n}. Xuất sắc!`,
  ] as L1,

  // ---------- Cô thưởng quà (quà đặt lên bàn). g = tên quà, vd "một ly trà sữa full topping" ----------
  firstCorrectGift: [
    (n, g) => `${n} đúng rồi! Cô thưởng ${g} nha.`,
    (n, g) => `Giỏi quá ${n}! Cô đặt ${g} lên bàn nè.`,
    (n, g) => `${n} nhanh nhất! Phần thưởng là ${g}.`,
    (n, g) => `Cô thưởng ${n} ${g}, ai muốn có thì trả lời nhanh lên.`,
    (n, g) => `${n} đúng đầu tiên, cô tặng ${g}. Cô hào phóng hôm nay thôi đó.`,
    (n, g) => `${n} giỏi ghê, cô thưởng ${g} nè. Đừng khoe với sếp.`,
  ] as L2,
  streakGift: [
    (n, g, k) => `${k} câu liền rồi ${n}! Thêm năm điểm, cô thưởng thêm ${g}.`,
    (n, g, k) => `${n} ${k} câu liền! Năm điểm với ${g}, thưởng nóng như thưởng Tết.`,
    (n, g, k) => `Chuỗi ${k} câu của ${n}! Năm điểm, kèm ${g} đặt lên bàn luôn.`,
  ] as L3,
  goldenGift: [
    (n, g) => `Câu hỏi vàng là của ${n}! Cô thưởng gấp đôi điểm, thêm ${g} nữa.`,
    (n, g) => `${n} giành câu hỏi vàng! Hai mươi điểm và ${g}.`,
  ] as L2,

  // ---------- Dừng giữa tiết: cô điểm danh người giỏi, tặng quà, rồi mới ra câu tiếp ----------
  praiseIntro: [
    'Dừng lại một chút nha. Cô điểm danh mấy bạn giỏi nhất từ đầu tiết nè.',
    'Nghỉ giải lao năm giây, cô xem bảng điểm như xem bảng lương vậy.',
    'Khoan ra câu tiếp, cô phát quà cho mấy bạn giỏi đã.',
    'Tạm dừng nè cả lớp. Ai đang dẫn đầu lớp mình?',
  ] as L0,
  // chế độ nhanh: điểm danh giữa tiết gộp 1 câu. n = "Minh 40 điểm, Lan 35 điểm, Hùng 30 điểm"
  praiseQuick: [
    (n) => `Nửa tiết rồi! Top 3 đang là ${n}. Quà cô để trên bàn rồi nha.`,
    (n) => `Bảng điểm giữa tiết: ${n}. Ba bạn có quà, còn lại đuổi theo đi!`,
    (n) => `Ai đang dẫn đầu? ${n}. Cô thưởng quà rồi, chơi tiếp nào!`,
  ] as L1,
  // n tên, s điểm, g quà
  praiseFirst: [
    (n, s, g) => `Đứng nhất là ${n}, ${s} điểm. Cô tặng ${g}.`,
    (n, s, g) => `Dẫn đầu đang là ${n} với ${s} điểm. Quà là ${g}.`,
    (n, s, g) => `Nhất lớp lúc này là ${n}, ${s} điểm. Cô đặt ${g} lên bàn nè.`,
  ] as L3,
  praiseSecond: [
    (n, s, g) => `Hạng nhì là ${n}, ${s} điểm, được ${g}.`,
    (n, s, g) => `Theo sát là ${n} với ${s} điểm, cô tặng ${g}.`,
  ] as L3,
  praiseThird: [
    (n, s, g) => `Hạng ba là ${n}, ${s} điểm, nhận ${g}.`,
    (n, s, g) => `Thứ ba là ${n}, ${s} điểm. Cô tặng ${g} cho bạn nha.`,
  ] as L3,
  // mời tương tác, sau câu này cô chờ vài giây rồi mới ra câu tiếp
  praiseOutro: [
    'Mấy bạn còn lại cố lên nha. Ai muốn được quà thì chào cô một tiếng đi nào.',
    'Ai chưa có quà thì thả tim cho cô xem nào, câu sau cố lên.',
    'Cả lớp vỗ tay cho mấy bạn giỏi nào. Ai thèm trà sữa thì gõ trà sữa cho cô đếm.',
    'Còn nhiều quà lắm, trả lời nhanh là có phần. Chuẩn bị câu tiếp nha.',
  ] as L0,

  // ---------- Hết tiết ----------
  results: [
    (n, s) => `Hết tiết! Nhất lớp tiết này là ${n}, được ${s} điểm. Cả lớp vỗ tay nào!`,
    (n, s) => `Tổng kết tiết học: ${n} đứng đầu với ${s} điểm. Giỏi quá!`,
    (n, s) => `Trống tan tiết rồi. Hạng nhất thuộc về ${n}, ${s} điểm.`,
    (n, s) => `${n} nhất tiết này, ${s} điểm. Cô treo ảnh lên bảng vàng, đẹp hơn ảnh thẻ nhân viên.`,
    (n, s) => `Chúc mừng ${n}, ${s} điểm, giấy khen tiết này là của bạn.`,
    (n, s) => `Ai cũng cố gắng, nhưng ${n} cố gắng nhất. ${s} điểm, nhất lớp!`,
    (n, s) => `Hết giờ! ${n} được ${s} điểm. Đi làm mà chăm vầy là lên chức rồi.`,
    (n, s) => `Nhất tiết này là ${n} với ${s} điểm. Mấy bạn khác tiết sau lấy lại nha.`,
  ] as L2,
  resultsNobody: [
    'Tiết này chưa ai ghi điểm. Tiết sau cả lớp cố lên nha.',
    'Không ai có điểm luôn. Cô đi mua trà sữa giải sầu rồi dạy lại từ đầu.',
    'Hết tiết mà bảng điểm trống trơn. Lớp mình ngủ đông rồi hả?',
    'Tiết này buồn quá, chưa ai đúng câu nào. Ra chơi xong làm lại nha.',
    'Không sao, tiết sau lớp mình phục thù.',
  ] as L0,

  newMonitor: [
    (n) => `Lớp mình có lớp trưởng mới rồi, là ${n}!`,
    (n) => `${n} vượt lên dẫn đầu tiết này, lên làm lớp trưởng luôn.`,
    (n) => `Đổi lớp trưởng! ${n} giờ đứng nhất tiết này.`,
    (n) => `Chức lớp trưởng về tay ${n}. Lớp trưởng cũ ráng giành lại đi.`,
    (n) => `${n} lên lớp trưởng. Thăng chức nhanh vậy, cô cũng muốn.`,
    (n) => `Bảng xếp hạng đổi rồi, ${n} làm lớp trưởng.`,
  ] as L1,

  // cuối giờ ra chơi: lớp trưởng tiết vừa rồi (mỗi tiết tranh lại từ đầu)
  championBoard: [
    (n) => `Lớp trưởng tiết vừa rồi là ${n}. Tiết sau ai giành ghế đây?`,
    (n) => `${n} vừa làm lớp trưởng. Tiết mới điểm làm lại từ đầu, ai cũng có cơ hội nha.`,
    (n) => `Chúc mừng lớp trưởng ${n}! Cả lớp tiết sau giành lại đi nào.`,
  ] as L1,
  // n tên, k số lần làm lớp trưởng
  championAgain: [
    (n, k) => `${n} làm lớp trưởng ${k} lần rồi đó! Có ai hạ được ${n} không?`,
    (n, k) => `Lại là ${n}, lớp trưởng ${k} lần! Ngồi ghế này lâu hơn cả sếp cô.`,
    (n, k) => `${k} lần lớp trưởng, ${n} giỏi quá trời. Ai muốn soán ngôi thì vào tiết sau.`,
  ] as L2,
  weekBoard: [
    (n) => `Bảng vàng tuần này, hạng nhất là ${n}.`,
    (n) => `Đứng đầu cả tuần là ${n}. Mai vào lớp tiếp để giữ hạng nha.`,
    (n) => `Tuần này ${n} đang nhất. Ai muốn vượt thì chăm vào lớp.`,
  ] as L1,

  // ---------- Quà, follow, chào ----------
  thankGift: [
    (n, g) => `Cô cảm ơn ${n} tặng ${g} nha.`,
    (n, g) => `Ôi ${g} của ${n}, cô thương nhất lớp.`,
    (n, g) => `${n} tặng cô ${g}. Học trò như vầy cô cưng lắm.`,
    (n, g) => `Cảm ơn ${n}! ${g} đẹp quá, cô cất kỹ liền.`,
    (n, g) => `${n} ơi, ${g} này cô giữ làm kỷ niệm.`,
    (n, g) => `Cô nhận ${g} của ${n} rồi nha. Cảm ơn bạn.`,
    (n, g) => `${n} tặng ${g} cho cô. Hôm nay cô khỏi than lương.`,
    (n, g) => `Hoa của ${n} đây. Cô cảm ơn, hôm nay cô vui lắm.`,
    (n, g) => `Ai như ${n}, vừa học giỏi vừa biết thương cô. Cảm ơn nha.`,
    (n, g) => `${n} tặng ${g}. Cô không cộng điểm đâu, nhưng cô nhớ mặt rồi đó.`,
    (n, g) => `Cảm ơn ${n}, ${g} làm lớp mình sáng hẳn lên.`,
    (n, g) => `${n} ơi cảm ơn nhiều. Thầy thể dục mà biết chắc ghen tị.`,
  ] as L2,
  bigGift: [
    (n) => `Trời ơi ${n} tặng quà to quá! Cả lớp vỗ tay cho bạn đi.`,
    (n) => `${n} chơi lớn quá. Cô cảm động muốn khóc luôn.`,
    (n) => `Quà to của ${n}! Cô phong làm lớp phó văn nghệ danh dự.`,
    (n) => `${n} ơi, quà này cô không dám nhận đâu... thôi nhận luôn. Cảm ơn nha!`,
    (n) => `Cả lớp nhìn ${n} mà học tập nha. Cảm ơn nhiều lắm.`,
    (n) => `${n} tặng quà xịn. Cô xếp ${n} ngồi bàn đầu trong tim cô.`,
  ] as L1,
  giftHint: [
    (n) => `${n} xin cô mở thêm một chữ, cả lớp nhờ bạn đó nha.`,
    (n) => `Nhờ quà của ${n}, cô mở thêm một chữ cho cả lớp.`,
    (n) => `${n} giải cứu cả lớp, mở thêm một chữ nè.`,
    (n) => `${n} tặng quà, cô thưởng cả lớp một chữ gợi ý.`,
    (n) => `Cảm ơn ${n}! Thêm một chữ trên bảng rồi, ai đoán ra nào?`,
    (n) => `${n} bao cả lớp một chữ. Cảm ơn bạn đi cả lớp.`,
  ] as L1,
  thankFollow: [
    (n) => `Cô cảm ơn ${n} đã theo dõi kênh nha.`,
    (n) => `${n} vừa theo dõi lớp mình. Chào học sinh mới!`,
    (n) => `Cảm ơn ${n} đã bấm theo dõi, mai nhớ vào lớp đúng giờ, đừng đi trễ như đi làm.`,
    (n) => `${n} vào sổ điểm danh của lớp rồi. Cảm ơn nha.`,
    (n) => `Học sinh mới ${n} đã theo dõi. Cả lớp chào bạn đi.`,
    (n) => `${n} theo dõi kênh rồi, cô nhớ mặt rồi đó.`,
  ] as L1,
  greeting: [
    (names) => `Chào ${names} vào lớp. Gõ đáp án vào bình luận là chơi được liền.`,
    (names) => `${names} vào lớp trễ nha, cô bỏ qua lần này. Ngồi xuống chơi luôn đi.`,
    (names) => `Lớp mình có thêm ${names}. Chào mừng nha.`,
    (names) => `${names} vừa vào. Kiếm chỗ ngồi đi, câu tiếp theo cô hỏi liền.`,
    (names) => `Ồ ${names} tới rồi. Cả lớp đông vui quá.`,
    (names) => `Chào ${names}. Muốn ngồi bàn đầu thì trả lời đúng nhiều vào.`,
    (names) => `${names} điểm danh có mặt. Trốn việc thành công, vào học thôi.`,
    (names) => `Hoan nghênh ${names}! Ai chưa biết luật thì cứ nhìn bảng mà đoán chữ.`,
  ] as L1,
  share: [
    'Thấy vui thì bấm chia sẻ live rủ bạn bè vào thi với lớp mình nha.',
    'Lớp đông mới vui, chia sẻ live cho đồng nghiệp vào học chung đi, sếp không biết đâu.',
    'Ai rủ được bạn vào lớp, cô ghi nhận công lao. Bấm chia sẻ nha.',
    'Chia sẻ live cho đứa bạn hay khoe giỏi vào đây thử sức coi.',
    'Bấm theo dõi kênh để mai còn vào lớp đúng giờ nha cả lớp.',
    'Thả tim cho đầy bảng đi cả lớp, đủ tim là cả lớp vỗ tay.',
    'Rủ thêm bạn vào đi, lớp còn nhiều ghế trống lắm.',
    'Ai chưa có ghế thì trả lời đúng nhiều để được vào lớp ngồi nha.',
  ] as L0,
  idle: [
    'Lớp im re vậy, ngủ hết rồi hả?',
    'Có ai còn ở đây không? Cô thấy lớp vắng như văn phòng chiều thứ sáu.',
    'Cả lớp đi ăn vặt hết rồi hay sao vậy?',
    'Im lặng quá, cô nghe được tiếng quạt máy luôn.',
    'Gõ gì đó đi cả lớp, cô đứng một mình buồn lắm.',
    'Ai còn thức thì gõ "có mặt" cho cô biết với.',
    'Lớp mình đang nghĩ đáp án hay đang lướt TikTok khác vậy?',
    'Cô đếm tới ba, không ai gõ là cô cho bài tập về nhà. Một... hai...',
    'Ủa, mạng rớt hay cả lớp rớt vậy?',
    'Im quá, cô tưởng mình đang họp với sếp lúc sếp hỏi ai có ý kiến.',
  ] as L0,
  clap: [
    'Đủ tim rồi, cả lớp vỗ tay nào!',
    'Tim đầy bảng rồi! Vỗ tay cho lớp mình!',
    'Cảm ơn cả lớp thả tim, cô vui quá. Vỗ tay!',
    'Tim nhiều quá, cô cho cả lớp vỗ tay ăn mừng.',
  ] as L0,

  // ---------- Giờ ra chơi ----------
  recessIntro: [
    'Ra chơi! Mười lăm phút... à không, một phút thôi. Chơi với cô một trò nha.',
    'Tùng tùng tùng, giờ ra chơi! Cô có trò này hay lắm.',
    'Giải lao chút nha cả lớp, coi như break giữa giờ họp.',
    'Ra chơi rồi! Gác deadline qua một bên, chơi với cô.',
    'Học mệt rồi, ra chơi một chút. Trò này dễ lắm, ai cũng chơi được.',
  ] as L0,

  rpsIntro: [
    'Oẳn tù tì với cô! Gõ búa, kéo hoặc bao. Thắng cô được cộng hai điểm.',
    'Chơi oẳn tù tì nha. Gõ búa, kéo hay bao vào bình luận. Cô ra sau cùng.',
    'Trò oẳn tù tì! Mỗi người gõ một lần thôi: búa, kéo hoặc bao.',
    'Ai dám đấu oẳn tù tì với cô? Gõ búa, kéo hoặc bao. Thắng được hai điểm.',
  ] as L0,
  rpsReveal: [
    (pick, rest) => `Cô ra ${pick}! ${rest}`,
    (pick, rest) => `Một, hai, ba, cô ra ${pick}. ${rest}`,
    (pick, rest) => `Oẳn tù tì ra cái gì ra cái này: ${pick}! ${rest}`,
    (pick, rest) => `Cô chọn ${pick} nha. ${rest}`,
  ] as L2,
  rpsWin: [
    (c) => `Có ${c} bạn thắng cô, mỗi bạn hai điểm.`,
    (c) => `${c} bạn thắng rồi, cô thua tâm phục khẩu phục.`,
    (c) => `Cô thua ${c} bạn. Hai điểm cho mỗi người.`,
  ] as L1,
  rpsLose: [
    (c) => `Có ${c} bạn chưa thắng cô ván này. Ván sau gỡ lại nha!`,
    (c) => `Cô may mắn thắng được ${c} bạn. Cô vẫn còn phong độ lắm.`,
    (c) => `${c} bạn hoà hoặc nhường cô thắng ván này. Cảm ơn cả lớp nha!`,
  ] as L1,
  rpsNobody: [
    'Không ai chơi với cô hết. Cô tự oẳn tù tì với cái bảng vậy.',
    'Lớp mình nhường cô thắng ván này đúng không?',
    'Không ai ra cái gì. Cô thắng mặc định nha.',
  ] as L0,

  callUp: [
    (n) => `Kiểm tra miệng! Cô mời ${n} lên bảng. Có mười lăm giây.`,
    (n) => `${n} đâu rồi? Lên bảng trả bài cho cô. Mười lăm giây nha.`,
    (n) => `Hôm nay cô gọi ${n}. Chỉ mình ${n} được trả lời câu này.`,
    (n) => `${n} ơi, tới lượt kiểm tra miệng. Cả lớp im lặng nghe bạn trả lời.`,
    (n) => `Cô dò tên trong danh sách... ${n}! Mời lên bảng.`,
    (n) => `${n} ơi, cô mời lên bảng thử sức câu này nha. Mười lăm giây, đúng được năm điểm.`,
    (n) => `Mời ${n} lên bảng! Các bạn khác cổ vũ cho bạn nha.`,
    (n) => `Kiểm tra miệng vui vẻ nha, cô chọn ${n}. Bình tĩnh tự tin lấy năm điểm nào!`,
  ] as L1,
  callUpRight: [
    (n) => `${n} trả lời đúng! Năm điểm, về chỗ.`,
    (n) => `Giỏi quá ${n}! Cô cho năm điểm miệng.`,
    (n) => `${n} học bài kỹ ghê. Đúng rồi, năm điểm nha.`,
    (n) => `Chuẩn rồi ${n}! Cả lớp vỗ tay cho bạn.`,
    (n) => `${n} qua bài kiểm tra miệng. Cô yên tâm rồi.`,
    (n) => `Đúng luôn ${n}. Cô định làm khó mà không ăn thua.`,
  ] as L1,
  callUpWrong: [
    (n) => `${n} chưa đúng câu này rồi. Về chỗ, lần sau gỡ lại nha.`,
    (n) => `Ôi ${n}, câu này hơi bất ngờ đúng không? Không sao nha.`,
    (n) => `${n} trả lời chưa trúng rồi. Lần sau cố lên lấy năm điểm nha.`,
    (n) => `Tiếc quá ${n} ơi, xém chút nữa là đúng rồi.`,
    (n) => `${n} ơi, đáp án hơi khác một chút. Về chỗ nghỉ ngơi câu sau gỡ lại nha.`,
    (n) => `Câu này hơi lắt léo nên ${n} nhầm chút xíu. Cô vẫn khen tinh thần xung phong.`,
    (n) => `${n} trả lời rất tự tin. Cô tặng điểm tinh thần nha.`,
    (n) => `Chưa đúng ${n} ơi. Cả lớp vỗ tay khích lệ bạn nha!`,
  ] as L1,
  callUpSilent: [
    (n) => `${n} chưa kịp gõ rồi. Chắc đang bận việc chút xíu.`,
    (n) => `Hết giờ mà ${n} chưa kịp trả lời. Cô để dành cơ hội cho lần sau nha.`,
    (n) => `${n} đâu rồi? Chắc đang đi lấy ly nước, hẹn câu sau nha.`,
    (n) => `${n} chưa kịp lên tiếng. Về chỗ chuẩn bị cho tiết tiếp theo nha.`,
    (n) => `${n} chắc đang đi lấy nước. Thôi để lần sau.`,
    (n) => `Mười lăm giây trôi qua nhanh quá, ${n} chưa kịp gõ. Hẹn lần sau nha.`,
    (n) => `${n} bận tay chút xíu rồi, cô mời bạn về chỗ nha.`,
    (n) => `${n} chưa kịp trả lời. Cả lớp vỗ tay cổ vũ bạn ở câu sau nha.`,
  ] as L1,

  pickIntro: [
    (a, b) => `Chọn phe nha! ${a} hay ${b}? Gõ số một nếu chọn ${a}, số hai nếu chọn ${b}.`,
    (a, b) => `Cả lớp chia phe: một là ${a}, hai là ${b}. Gõ số đi.`,
    (a, b) => `Câu hỏi khó nhất hôm nay: ${a} hay ${b}? Gõ một hoặc hai.`,
    (a, b) => `Bỏ phiếu nha. Số một là ${a}, số hai là ${b}.`,
  ] as L2,
  pickResult: [
    (win, pct) => `Phe ${win} thắng với ${pct} phần trăm.`,
    (win, pct) => `${pct} phần trăm cả lớp chọn ${win}. Đông vui quá trời!`,
    (win, pct) => `Kết quả: ${win} thắng, ${pct} phần trăm.`,
    (win, pct) => `Lớp mình chọn ${win}, ${pct} phần trăm luôn.`,
  ] as L2,
  pickRoast: [
    (lose) => `Phe ${lose} hôm nay hơi ít đồng minh chút xíu, lần sau rủ thêm bạn nha.`,
    (lose) => `Ai chọn ${lose} là có gu riêng độc đáo lắm đó nha.`,
    (lose) => `Phe ${lose} tuy ít hơn nhưng tinh thần vẫn rất nhiệt huyết.`,
    (lose) => `Cô thấy cả hai món đều tuyệt, phe ${lose} đừng buồn nha.`,
    (lose) => `${lose} cũng ngon mà, chắc hôm nay cả lớp đổi khẩu vị chút xíu.`,
    (lose) => `Phe ${lose} ơi, giữ vững đam mê nha, cô vẫn ủng hộ tinh thần các bạn!`,
  ] as L1,
  pickTie: [
    'Hòa luôn! Lớp mình chia đôi rõ ràng quá.',
    'Hai phe bằng nhau. Thôi khỏi cãi, chọn cả hai.',
  ] as L0,
  pickNobody: [
    'Không ai chọn phe nào. Lớp mình trung lập ghê.',
    'Chưa ai bỏ phiếu hết. Thôi cô chọn giùm luôn.',
  ] as L0,

  rollIntro: [
    'Điểm danh siêu tốc! Gõ "có mặt" thật nhanh. Mười bạn đầu tiên được ba điểm.',
    'Ai có mặt thì gõ "có mặt"! Mười bạn nhanh nhất có điểm, nhanh hơn chấm công nha.',
    'Cô điểm danh nè, gõ "có mặt" đi. Nhanh tay thì có ba điểm.',
    'Điểm danh! Gõ "có mặt". Mười bạn đầu tiên cô cộng ba điểm.',
  ] as L0,
  rollResult: [
    (names) => `Nhanh nhất là ${names}. Mỗi bạn ba điểm.`,
    (names) => `Có mặt sớm nhất: ${names}. Ba điểm nha.`,
    (names) => `${names} điểm danh nhanh nhất. Cộng ba điểm.`,
    (names) => `Cô ghi nhận ${names} có mặt đầu tiên.`,
  ] as L1,
  rollNobody: [
    'Không ai có mặt hả? Vậy cô dạy cho ai nghe?',
    'Điểm danh mà không ai trả lời. Cả lớp trốn học hết rồi.',
  ] as L0,

  // thả tim cả lớp (chủ kênh 2026-11-07): không còn mốc 300, máy chỉ đếm, thả bao nhiêu nhảy bấy nhiêu
  heartIntro: [
    'Thả tim cả lớp! Chạm màn hình thả tim đi nào, thả bao nhiêu máy đếm bấy nhiêu.',
    'Giờ ra chơi thả tim! Cả lớp thả thật nhiều, xem lớp mình được bao nhiêu tim nha.',
    'Tim nào tim nào! Ai cũng chạm màn hình thả tim đi, cô đếm hết.',
    'Thả tim tiếp sức cho lớp nào! Máy đếm đang chạy rồi đó.',
  ] as L0,
  // c = tổng tim, n = bạn thả nhiều nhất (rỗng thì thôi)
  heartDone: [
    (c, n) => `Cả lớp thả được ${c} tim! ${n ? `Cảm ơn ${n} thả nhiều tim nhất, ` : ''}cảm ơn cả lớp nhiều nha.`,
    (c, n) => `Wow, ${c} tim luôn! ${n ? `${n} là cây thả tim số một. ` : ''}Cô cảm ơn cả lớp nha.`,
    (c, n) => `Tổng kết: ${c} tim! Lớp mình đoàn kết quá. ${n ? `Đặc biệt cảm ơn ${n} nha.` : ''}`,
  ] as L2,
  heartNobody: [
    'Chưa có tim nào hết. Lần sau nhớ chạm màn hình thả tim cho lớp nha.',
    'Không ai thả tim hả? Cô buồn nhẹ, lần sau thả cho cô với nha.',
  ] as L0,

  // ---------- Giờ ra chơi nhảy múa thả tim (2026-11-07) ----------
  danceIntro: [
    'Giờ ra chơi! Cả lớp lên bảng nhảy múa hát ca nào. Bên ngoài thả tim tăng cường sức khoẻ cho lớp mình nha!',
    'Nhạc lên! Các bạn lên bảng quẩy đi, ai ở ngoài thì thả tim cổ vũ cho cả lớp khoẻ re nào.',
    'Ngồi học mỏi lưng rồi, đứng dậy nhảy một bài cho khoẻ nha cả lớp! Thả tim tiếp sức cho các bạn đi nào.',
    'Giờ ra chơi bung xoã! Cả lớp lên nhảy, tim bay càng nhiều cả lớp càng khoẻ.',
  ] as L0,
  // giữa giờ nhảy: c = số tim tới giờ, n = bạn thả nhiều nhất (rỗng thì chưa ai)
  danceCheer: [
    (c, n) => `Đã được ${c} tim rồi! ${n ? `${n} thả tim nhiệt tình quá. ` : ''}Thả tiếp nữa nào cả lớp!`,
    (c, n) => `${c} tim rồi nha, nhảy tiếp đi! ${n ? `Cô thấy ${n} thả tim không nghỉ luôn.` : 'Ai chưa thả thì chạm màn hình liền nha.'}`,
    (c, n) => `Máy đếm báo ${c} tim! ${n ? `${n} đang dẫn đầu thả tim đó. ` : ''}Quẩy lên cả lớp ơi!`,
  ] as L2,
  // hết giờ nhảy: c = tổng tim, n = bạn thả nhiều nhất
  danceThanks: [
    (c, n) => `Hết giờ ra chơi! Cả lớp thả được ${c} tim, khoẻ re luôn. ${n ? `Cảm ơn ${n} thả nhiều tim nhất, ` : ''}cảm ơn cả lớp nhiều nha!`,
    (c, n) => `Tổng kết: ${c} tim! Cô cảm ơn cả lớp đã tiếp sức. ${n ? `Đặc biệt cảm ơn ${n} nha.` : ''} Về chỗ học tiếp thôi nào.`,
    (c, n) => `Wow, ${c} tim! Lớp mình nhảy đẹp mà tim cũng nhiều. ${n ? `${n} là cây thả tim số một hôm nay. ` : ''}Cảm ơn cả lớp nha!`,
  ] as L2,
  danceNobody: [
    'Nhảy mà không ai thả tim hết. Thôi về chỗ học tiếp, lần sau nhớ tiếp sức cho lớp nha.',
    'Không có tim nào luôn, cô nhảy một mình hơi quê. Về chỗ thôi cả lớp.',
  ] as L0,

  // ---------- Thầy quản lớp mời bạn ngồi im lâu nghỉ giải lao, nhường ghế cho bạn mới (2026-11-07): a = bạn ra, b = bạn vào ----------
  escort: [
    (a, b) => `Thầy quản lớp tới hỗ trợ nè! ${a} đang tạm nghỉ giải lao nên nhường ghế cho ${b} vào lớp ngồi học tiếp nha.`,
    (a, b) => `Cả lớp chào đón ${b} tương tác nhiệt tình vào ngồi ghế nha! Cảm ơn ${a} đã nhường chỗ, khi nào quay lại chỉ cần bình luận là có ghế.`,
    (a, b) => `${a} đang tạm nghỉ tay chút xíu, thầy quản lớp mời ${b} vào ngồi ghế học cùng cả lớp nha.`,
    (a, b) => `Mời ${b} vào bàn học! ${a} nghỉ giải lao uống miếng nước, lát bình luận một câu là vào lớp tiếp nha.`,
  ] as L2,
  // không ai chờ ghế (chủ kênh bấm nút thử): chỉ đưa bạn ra nghỉ giải lao
  escortAlone: [
    (a) => `Thầy quản lớp mời ${a} tạm nghỉ giải lao uống miếng nước nha. Khi nào quay lại chỉ cần bình luận một câu là vào ghế liền.`,
    (a) => `${a} đang tạm nghỉ tay chút xíu, lúc nào quay lại bình luận là thầy xếp ghế vào học tiếp nha.`,
  ] as L1,
};

// Bình chọn vui lúc chờ trả lời: gõ 1 chữ cái (đáp án câu chữ luôn từ 2 chữ nên không lẫn). key viết thường, không dấu.
export interface Poll {
  ask: string;
  opts: { key: string; label: string }[];
}
export const POLLS: Poll[] = [
  {
    ask: 'Cả lớp ở đâu nè? Miền Bắc gõ chữ B, miền Trung gõ chữ T, miền Nam gõ chữ N nha!',
    opts: [{ key: 'b', label: 'miền Bắc' }, { key: 't', label: 'miền Trung' }, { key: 'n', label: 'miền Nam' }],
  },
  {
    ask: 'Đang làm gì đó cả lớp? Đang làm việc gõ chữ L, đang ăn gõ chữ A, đang nằm lướt điện thoại gõ chữ N nha!',
    opts: [{ key: 'l', label: 'phe đang làm việc' }, { key: 'a', label: 'phe đang ăn' }, { key: 'n', label: 'phe nằm lướt điện thoại' }],
  },
  {
    ask: 'Thích chó thì gõ chữ C, thích mèo thì gõ chữ M nha!',
    opts: [{ key: 'c', label: 'phe thích chó' }, { key: 'm', label: 'phe thích mèo' }],
  },
  {
    ask: 'Đi làm hay đi học? Đi làm gõ chữ L, đi học gõ chữ H, đang thất nghiệp vui vẻ gõ chữ T!',
    opts: [{ key: 'l', label: 'phe đi làm' }, { key: 'h', label: 'phe đi học' }, { key: 't', label: 'phe thất nghiệp vui vẻ' }],
  },
  {
    ask: 'Trà sữa gõ chữ T, cà phê gõ chữ C. Cả lớp sống nhờ món nào?',
    opts: [{ key: 't', label: 'phe trà sữa' }, { key: 'c', label: 'phe cà phê' }],
  },
  {
    ask: 'Ăn phở gõ chữ P, ăn bún gõ chữ B, ăn cơm tấm gõ chữ C. Cả lớp thích món nào?',
    opts: [{ key: 'p', label: 'phe phở' }, { key: 'b', label: 'phe bún' }, { key: 'c', label: 'phe cơm tấm' }],
  },
  {
    ask: 'Đang độc thân gõ chữ D, có người yêu gõ chữ Y, mập mờ gõ chữ M. Khai thật đi cả lớp!',
    opts: [{ key: 'd', label: 'phe độc thân' }, { key: 'y', label: 'phe có người yêu' }, { key: 'm', label: 'phe mập mờ' }],
  },
  {
    ask: 'Cuối tháng còn tiền gõ chữ C, hết tiền rồi gõ chữ H. Cô hỏi cho biết thôi.',
    opts: [{ key: 'c', label: 'phe còn tiền' }, { key: 'h', label: 'phe hết tiền' }],
  },
  {
    ask: 'Thứ hai thấy vui gõ chữ V, thấy mệt gõ chữ M nha cả lớp!',
    opts: [{ key: 'v', label: 'phe yêu thứ hai' }, { key: 'm', label: 'phe sợ thứ hai' }],
  },
  {
    ask: 'Ngủ trước mười hai giờ gõ chữ S, thức khuya gõ chữ K. Cô đoán phe K thắng.',
    opts: [{ key: 's', label: 'phe ngủ sớm' }, { key: 'k', label: 'phe thức khuya' }],
  },
];

// Câu hỏi "chọn phe" cho giờ ra chơi
export const PICK_TOPICS: [string, string][] = [
  ['phở', 'bún bò'],
  ['trà sữa', 'cà phê'],
  ['chó', 'mèo'],
  ['đi biển', 'đi núi'],
  ['Tết ở quê', 'Tết ở phố'],
  ['mì tôm trứng', 'mì tôm xúc xích'],
  ['ngủ nướng', 'dậy sớm'],
  ['ăn cay', 'không ăn cay'],
  ['làm ở nhà', 'lên văn phòng'],
  ['xem phim', 'chơi game'],
  ['bánh mì', 'xôi'],
  ['nhắn tin', 'gọi điện'],
  ['lương cao mà bận', 'lương vừa mà nhàn'],
  ['cơm nhà', 'cơm quán'],
  ['tóc dài', 'tóc ngắn'],
  ['đi xe máy', 'đi ô tô'],
  ['họp buổi sáng', 'họp buổi chiều'],
  ['crush nhắn trước', 'mình nhắn trước'],
  ['kem', 'chè'],
  ['nhạc ballad', 'nhạc remix'],
  ['gà rán', 'pizza'],
  ['ở nhà cuối tuần', 'đi chơi cuối tuần'],
  ['săn sale', 'mua giá gốc cho nhanh'],
  ['bánh chưng', 'bánh tét'],
  ['người yêu', 'tiền'],
  ['sầu riêng', 'mít'],
  ['trà đá', 'trà chanh'],
  ['Hà Nội', 'Sài Gòn'],
  ['iPhone', 'Android'],
  ['xem TikTok', 'xem YouTube'],
];
