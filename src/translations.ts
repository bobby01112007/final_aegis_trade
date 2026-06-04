export interface AppTranslation {
  nav: {
    platform: string;
    solutions: string;
    insights: string;
    regulations: string;
    manifesto: string;
    contact: string;
    launchCta: string;
    changeLanguageBtn: string;
  };
  hero: {
    badge: string;
    title1: string;
    title2: string;
    title3: string;
    title4: string;
    subtitle: string;
    triggerBtn: string;
    plansBtn: string;
    badge1: string;
    badge2: string;
    badge3: string;
  };
  problem: {
    tag: string;
    title: string;
    desc1: string;
    desc2: string;
    desc3: string;
    timelineTitle: string;
    modelTraditional: string;
    modelAegis: string;
    stepPaperwork: string;
    stepPaperworkDesc: string;
    stepQuarantine: string;
    stepQuarantineDesc: string;
    stepAudit: string;
    stepAuditDesc: string;
    stepGate: string;
    stepGateDesc: string;
    stepAegisOcr: string;
    stepAegisOcrDesc: string;
    stepAegisQuery: string;
    stepAegisQueryDesc: string;
    stepAegisApproved: string;
    stepAegisApprovedDesc: string;
  };
  workspace: {
    title: string;
    subtitle: string;
    recentHistory: string;
    resetSystem: string;
    uploadTitle: string;
    chooseSample: string;
    dragDrop: string;
    fileLimit: string;
    analyzingDoc: string;
    parsingDoc: string;
    signatureOption: string;
    simulateUnsigned: string;
    simulateSigned: string;
    reportHeader: string;
    complRatio: string;
    confidence: string;
    suggestedHs: string;
    destinationFit: string;
    fitYes: string;
    fitNo: string;
    rawTextPreview: string;
    issuesTitle: string;
    noIssues: string;
    exportPdf: string;
    recentScansDrawer: string;
    sampleDocs: {
      dragon: string;
      coffee: string;
      mango: string;
    };
    complianceSteps: string[];
    riskLevels: {
      high: string;
      medium: string;
      low: string;
    };
  };
  solutions: {
    tag: string;
    title1: string;
    title2: string;
    subtitle: string;
    triggerWorkflow: string;
    items: {
      title: string;
      tag: string;
      desc: string;
    }[];
  };
  insights: {
    tag: string;
    title1: string;
    title2: string;
    subtitle: string;
    items: {
      date: string;
      source: string;
      status: string;
      title: string;
      body: string;
      badge: string;
    }[];
  };
  manifesto: {
    tag: string;
    title1: string;
    title2: string;
    subtitle: string;
    problemTitle: string;
    problemDesc1: string;
    problemDesc2: string;
    philosophyTitle: string;
    philosophyDesc: string;
    pillarsTitle: string;
    pillar1Tag: string;
    pillar1Title: string;
    pillar1Desc: string;
    pillar2Tag: string;
    pillar2Title: string;
    pillar2Desc: string;
    pillar3Tag: string;
    pillar3Title: string;
    pillar3Desc: string;
    joinTitle: string;
    joinDesc: string;
    partnerBtn: string;
  };
  contact: {
    tag: string;
    title: string;
    subtitle: string;
    fieldName: string;
    fieldNamePl: string;
    fieldEmail: string;
    fieldEmailPl: string;
    fieldOrg: string;
    fieldOrgPl: string;
    fieldNote: string;
    fieldNotePl: string;
    submitBtn: string;
    successTitle: string;
    requestId: string;
    successDesc: string;
    retryBtn: string;
  };
  audio: {
    cursorActive: string;
    cursorMuted: string;
    cursorHelp: string;
    audioGen: string;
    audioGenSub: string;
    muteBtn: string;
    activateBtn: string;
    closeBtn: string;
    description: string;
    presetsTitle: string;
    presets: {
      name: string;
      desc: string;
    }[];
  };
  chat: {
    tag: string;
    title: string;
    welcomeMsg: string;
    presetsTitle: string;
    placeholder: string;
    sendBtn: string;
    errorMsg: string;
    emptyMsg: string;
    presets: string[];
  };
}

export const APP_TRANSLATIONS: Record<'vi' | 'en', AppTranslation> = {
  vi: {
    nav: {
      platform: "Nền tảng",
      solutions: "Giải pháp",
      insights: "Tin tức",
      regulations: "Quy chuẩn",
      manifesto: "Tuyên ngôn",
      contact: "Liên hệ",
      launchCta: "Vào Nền Tảng",
      changeLanguageBtn: "🇺🇸 English"
    },
    hero: {
      badge: "NỀN TẢNG KIỂM TRA THÔNG QUAN NÔNG SẢN AI",
      title1: "Đưa",
      title2: "Nông Sản Việt Nam",
      title3: "thông suốt",
      title4: "đến mọi thị trường.",
      subtitle: "Kiểm tra xuất khẩu thông minh. Hệ thống hóa quy tắc kiểm dịch (SPS), trích xuất chứng từ tức thì qua OCR kết hợp AI thông minh, phát hiện sai sót hồ sơ trong vòng chưa đầy 3 phút.",
      triggerBtn: "Kiểm Tra Chứng Từ Ngay",
      plansBtn: "Khám Phá Các Gói Dịch Vụ",
      badge1: "Đạt chuẩn Hải quan Việt Nam",
      badge2: "Trích xuất song ngữ (EN/VN)",
      badge3: "Đồng bộ cổng dữ liệu GACC & FDA"
    },
    problem: {
      tag: "ĐIỂM NGHẼN TRONG VẬN TẢI BIÊN GIỚI",
      title: "Trì hoãn tại cửa khẩu: Khủng hoảng âm thầm của nông sản",
      desc1: "Ngành xuất khẩu nông sản tươi và trái cây Việt Nam thường xuyên chịu tổn thất lớn do trì hoãn tại cửa khẩu quốc tế. Quá trình kiểm dịch thực tế, rà soát chứng từ khai hải quan thủ công thường kéo dài từ 7 đến 15 ngày.",
      desc2: "Mỗi ngày lưu kho bãi không chỉ làm gia tăng hàng nghìn USD phí vận chuyển lưu container (demurrage), mà quan trọng hơn là làm suy giảm độ tươi ngon của nông sản Việt, dẫn đến nguy cơ bị từ chối nhập cảnh ngay khi dỡ hàng tại cảng đích.",
      desc3: "Aegis Trade sinh ra để số hóa toàn diện quy trình kiểm chéo kỹ thuật, rút ngắn thời gian xếp hồ sơ từ nhiều ngày xuống chỉ còn vài phút trước khi tàu khởi hành.",
      timelineTitle: "So sánh hiệu suất: Quy trình cũ và Aegis Trade",
      modelTraditional: "Quy trình Logistics truyền thống (7 - 15 ngày)",
      modelAegis: "Quy trình tự động hóa Aegis Trade (Dưới 3 phút)",
      stepPaperwork: "Khai báo giấy tờ thủ công",
      stepPaperworkDesc: "Gửi hồ sơ kiểm soát dạng bản in rời rạc, dễ sai số liệu giữa Hóa đơn (Invoice) và Phiếu đóng gói (Packing List).",
      stepQuarantine: "Lấy mẫu kiểm dịch thực vật (SPS)",
      stepQuarantineDesc: "Xử lý thủ công tại biên giới, xét nghiệm vi sinh phòng lab tốn thời gian dài chờ đợi phản hồi của nước nhập khẩu.",
      stepAudit: "Kiểm tra mã HS/MRL thủ công",
      stepAuditDesc: "Nhân viên rà soát thủ công danh sách dư lượng hóa chất (MRL) dễ sai lệch do luật liên tục cập nhật đổi mới.",
      stepGate: "Thông quan biên giới",
      stepGateDesc: "Hàng chất đống chờ đóng dấu mộc đỏ chính thức sau hàng tuần ách tắc vận chuyển.",
      stepAegisOcr: "Trích xuất văn bản AI",
      stepAegisOcrDesc: "OCR nhận diện văn bản, chữ ký, hóa chất tồn dư tức thì trên tất cả file tải lên.",
      stepAegisQuery: "Kiểm chéo MRL/SPS điện tử",
      stepAegisQueryDesc: "Đối chiếu tự động thời gian thực với kho luật FDA, GACC CIFER và Bộ quy chuẩn SPS Nhật Bản.",
      stepAegisApproved: "Nhận Hộ chiếu Thông quan",
      stepAegisApprovedDesc: "Đạt chuẩn compliance, sẵn sàng thông quan luồng xanh không tắc nghẽn biên mốc."
    },
    workspace: {
      title: "Hệ thống xác minh Aegis",
      subtitle: "HỆ THỐNG KIỂM TRA QUY CÁCH DỮ LIỆU & GIẤY PHÉP XUẤT KHẨU v4.1",
      recentHistory: "Lịch sử gần đây",
      resetSystem: "Làm mới toàn bộ",
      uploadTitle: "TẢI LÊN & KIỂM TRA CHỨNG TỪ",
      chooseSample: "Chọn chứng từ xuất khẩu mẫu để chạy thử:",
      dragDrop: "Kéo thả chứng từ xuất khẩu vào đây, hoặc click để chọn tệp",
      fileLimit: "Hỗ trợ định dạng PDF, CSV, XLSX, PNG và DOCX tối đa 45MB.",
      analyzingDoc: "AI đang phân tích cấu trúc chứng từ...",
      parsingDoc: "Đang đọc bản văn mã hóa...",
      signatureOption: "Trạng thái con dấu & chữ ký mẫu:",
      simulateUnsigned: "Mô phỏng chứng từ LỖI con dấu/thiếu chữ ký",
      simulateSigned: "Mô phỏng chứng từ HỢP LỆ chữ ký & con dấu",
      reportHeader: "BÁO CÁO KẾT QUẢ PHÂN TÍCH CHỨNG TỪ",
      complRatio: "Tỷ lệ Đạt Chuẩn",
      confidence: "Độ tin cậy mã HS",
      suggestedHs: "Gợi ý mã HS phù hợp",
      destinationFit: "Mức độ phù hợp thị trường đích",
      fitYes: "CỰC KỲ KHỚP TIÊU CHUẨN",
      fitNo: "KHÔNG ĐẠT TIÊU CHUẨN KỸ THUẬT",
      rawTextPreview: "Cơ sở văn bản trích xuất (AI Metadata):",
      issuesTitle: "HẠNG MỤC SAI LỆCH VÀ BẤT THƯỜNG TRUY XUẤT (CẦN KHẮC PHỤC):",
      noIssues: "Tuyệt hảo. Không phát hiện bất kỳ dấu hiệu sai lệch kỹ thuật nào trên chứng từ.",
      exportPdf: "Xuất Báo Cáo Hải Quan PDF",
      recentScansDrawer: "Lịch sử kiểm tra gần đây (Dữ liệu lưu trữ)",
      sampleDocs: {
        dragon: "Thanh Long Bình Thuận xuất khẩu đi Trung Quốc (GACC)",
        coffee: "Cà phê Robusta Đắk Lắk xuất khẩu đi Mỹ (FDA/FSMA)",
        mango: "Xoài Cát Chu Cao Lãnh xuất khẩu đi Nhật Bản"
      },
      complianceSteps: [
        "Phân tích cấu trúc trang bìa và định dạng văn bản...",
        "Trích xuất siêu dữ liệu thông tin (Nhà xuất khẩu, Cảng đi, Cảng đến và Mã số thuế)...",
        "Chuyển tiếp phân loại mã số hàng hóa nội bộ (HS-Code Matcher)...",
        "Nhận dạng chữ ký cán bộ và con dấu đỏ cấp phép kiểm dịch thực vật...",
        "Truy vấn cơ sở dữ liệu cấm vận quốc tế và danh sách đen hải quan toàn cầu...",
        "Đối chiếu hiệp định thương mại song phương và điều khoản tối huệ quốc...",
        "Tổng hợp báo cáo số liệu và cấp hộ chiếu Aegis điện tử..."
      ],
      riskLevels: {
        high: "Nghiêm trọng (Hàng sẽ bị giữ)",
        medium: "Cảnh báo (Khuyến nghị sửa đổi)",
        low: "Lưu ý nhỏ"
      }
    },
    solutions: {
      tag: "CÁC CHƯƠNG TRÌNH PHÁP PHÒNG CHUYÊN BIỆT",
      title1: "Giải pháp cho",
      title2: "Logistics và Hợp tác xã nông nghiệp",
      subtitle: "Được thiết kế tinh gọn để loại bỏ ách tắc bến cảng và tạo hành lang thông suốt cho các doanh nghiệp agrarian Việt Nam.",
      triggerWorkflow: "Chạy thử quy trình phân tích AI",
      items: [
        {
          title: "Thư viện quản lý Quy tắc toàn cầu",
          tag: "DANH MỤC THỜI GIAN THỰC",
          desc: "Cung cấp cho Freight Forwarder quyền tra cứu tập trung, tinh gọn về luật kiểm dịch (SPS), tiêu chuẩn chất lượng (VietGAP/GlobalGAP) và giới hạn dư lượng thuốc trừ sâu (MRL) tại các thị trường trọng điểm: Mỹ (FDA), Trung Quốc (GACC 248), Nhật Bản, Hàn Quốc. Không còn quy trình tìm kiếm thủ công mệt mỏi trên các trang chính phủ nước ngoài."
        },
        {
          title: "Công cụ tách siêu dữ liệu AI + OCR",
          tag: "SỐ HÓA HỒ SƠ TỨC THỜI",
          desc: "Tự động sắp xếp cấu trúc, dịch thuật và phân tách chỉ số kỹ thuật từ Hóa đơn (Invoice), Packing List, Vận đơn tàu biển (B/L) và các chứng thư kiểm dịch thực vật. Phát hiện các lỗi lệch khối lượng tịnh, sai địa chỉ nhà xuất khẩu."
        },
        {
          title: "Hệ thống kiểm chéo kịch bản rủi ro",
          tag: "PHÒNG NGỪA ÁCH TẮC TRƯỚC BIÊN GIỚI",
          desc: "Áp dụng thuật toán chuyên sâu để rà soát thành phần hóa học đối chiếu với quy chuẩn nước nhập khẩu ngoài biên giới. Chia phản hồi trực quan theo các mức cảnh báo rõ ràng: 🟢 Đạt chuẩn luồng xanh, 🟡 Cần sửa đổi, hoặc 🔴 Nghiêm trọng dễ bị tiêu hủy."
        },
        {
          title: "Mô hình SaaS & Cổng thanh toán tiện lợi",
          tag: "TIẾP CẬN BÌNH DÂN CHO HỢP TÁC XÃ",
          desc: "Khen thưởng sự vươn tầm của mọi quy mô hợp tác xã với các gói dịch vụ hằng tuần, hằng tháng hợp túi tiền. Thanh toán trực quan với người dùng Việt Nam qua mã QR Ngân hàng (VietQR), ví MoMo, hay ZaloPay."
        }
      ]
    },
    insights: {
      tag: "TIN TỨC CẬP NHẬT CHÍNH SÁCH QUỐC TẾ",
      title1: "Tin tức",
      title2: "Cập nhật Hải quan & Rào cản kỹ thuật",
      subtitle: "Báo cáo liên tục về những thay đổi giấy phép vận tải biểu thuế, danh sách vi khuẩn kiểm dịch khẩn cấp từ các tổ chức hải quan.",
      items: [
        {
          date: "26 Tháng 5, 2026",
          source: "TỔ CHỨC HẢI QUAN CHÂU ÂU",
          status: "HIỆU LỰC CHÍNH THỨC",
          title: "Áp dụng cơ chế khai báo lượng khí thải CBAM đối với nông nghiệp chế biến sâu",
          body: "Các tệp chứng từ xuất khẩu nộp vào cảng biển Châu Âu bắt buộc đính kèm lượng phát thải carbon có kiểm toán độc lập bên thứ ba từ ngày 1 tháng 7. Sự bất nhất số liệu sẽ dẫn đến ách tắc thông quan.",
          badge: "BẮT BUỘC ĐẠT CHUẨN CAO"
        },
        {
          date: "20 Tháng 5, 2026",
          source: "CỤC KIỂM DỊCH THỰC VẬT NHẬT BẢN",
          status: "HẠN CHẾ THÔNG QUAN",
          title: "Rà soát bổ sung chứng nhận xử lý hơi nước nóng (VHT) hạt giống",
          body: "Yêu cầu khắt khe về chỉ số sấy hơi nước chống lây nhiễm nấm mốc cần chứng nhận kiểm tác VHT tại lab chỉ định ở Đông Nam Á, kéo dài thêm 48 giờ rà soát biên giới theo chính sách mới.",
          badge: "AN TOÀN SINH HỌC NÔNG NGHIỆP"
        },
        {
          date: "15 Tháng 5, 2026",
          source: "BỘ TÀI CHÍNH HOA KỲ",
          status: "ĐIỀU CHỈNH LUẬT TÀI PHÁP",
          title: "Thay đổi biểu thuế phân ngạch đặc khu kinh tế đối với sản phẩm tinh bột mì xuất khẩu",
          body: "Danh mục phân loại mới theo mã HS-Code phân dải 1108 thay đổi mức thuế suất cơ bản của khối ASEAN. Khuyên nghị các forwarder rà soát sớm hợp đồng bảo hiểm vận chuyển hàng hóa.",
          badge: "BẢNG BIỂU THUẾ QUAN MỚI"
        }
      ]
    },
    manifesto: {
      tag: "BẢN TUYÊN NGÔN THƯƠNG MẠI AEGIS",
      title1: "Tuyên ngôn vì một",
      title2: "Hành lang Xuất Khẩu Không Biên Giới",
      subtitle: "Bản vẽ triết lý vận tải và kiến trúc công nghệ giảm thiểu lực cản hành chính cho chuỗi cung ứng nông sản Việt.",
      problemTitle: "Lực cản giấy tờ của hệ thống Logistics hiện đại",
      problemDesc1: "Ngày nay, các đội tàu container vận tốc cao vượt Thái Bình Dương nhanh hơn tốc độ xử lý giấy tờ cấp phép thông quan bến đậu. Hàng hóa đến cảng đích chỉ trong ít ngày nhưng phải nằm chờ bãi xếp bốc nát vụn hàng tuần để chờ phản hồi thủ công từ cục đăng kiểm dịch tễ, đại sứ quán xác nhận vùng trồng và phân loại hải quan sai mốc.",
      problemDesc2: "Sự tắc nghẽn này không xuất phát từ hạ tầng xếp dỡ bãi container, mà xuất phát từ việc cát cứ thông tin giấy tờ giữa các cơ quan. Sự chậm trễ thủ tục hành chính cướp đi hàng tỷ USD giá trị thương mại nông sản Việt mỗi năm, đẩy các hợp tác xã nông dân vào thế bị ép giá.",
      philosophyTitle: "Triết lý cốt lõi: Quy tắc chính xác dạng mã hóa",
      philosophyDesc: "Chúng tôi khẳng định quy định thương mại quan thuế không phải rào cản cảm tính cá nhân, mà là các chuỗi logic chuẩn hóa. Bằng cách định nghĩa các biểu thuế quan, ngưỡng hóa chất trừ sâu MRL, mã GACC thành các thuật toán phần mềm tự kiểm chéo dữ liệu, chúng tôi tiến tới một Kỷ nguyên Quy chuẩn Tương đương. Ở đó, mọi chứng từ đều được chứng minh hợp pháp trực quan tức thì.",
      pillarsTitle: "Ba Trụ Cột Công Nghệ Kiến Tạo Tương Lai",
      pillar1Tag: "TRỤ CỘT I",
      pillar1Title: "Hạ tầng Quy chuẩn Mở",
      pillar1Desc: "Tất cả các rào cản kỹ thực vật (SPS), luật kiểm dịch và biểu thuế vụ phải hoạt động như điểm kết nối API chạy mượt mà, thay vì các đống giấy văn bản PDF ẩn sâu trong trang web chính phủ cổ hủ.",
      pillar2Tag: "TRỤ CỘT II",
      pillar2Title: "Cổng xác thực Bảo mật",
      pillar2Desc: "Quyền bảo mật thông tin thương mại của doanh nghiệp là tối thượng. Quy trình kiểm tra toán học thông minh cam kết che giấu hoàn toàn bí mật thương mại nhưng vẫn đảm bảo tính tuân thủ tối đa đối với nước nhập khẩu.",
      pillar3Tag: "TRỤ CỘT III",
      pillar3Title: "Tiếp cận Bình đẳng",
      pillar3Desc: "Hành lang thông quan nhanh không nên chỉ là đặc quyền của các tập đoàn khổng lồ. Chúng tôi mang các công cụ tuân thủ cao cấp nhất đến tay những hợp tác xã xuất khẩu nhỏ bé nhất tại Việt Nam.",
      joinTitle: "Đăng ký tham gia liên minh không biên giới",
      joinDesc: "Đưa tổ chức và doanh nghiệp của bạn gia nhập mạng lưới vận tải thế hệ mới mượt mà.",
      partnerBtn: "Trở thành đối tác Aegis"
    },
    contact: {
      tag: "LIÊN LẠC THỜI GIAN THỰC",
      title: "Yêu cầu hành lang thông quan xanh",
      subtitle: "Đăng ký phòng tuân thủ quy tắc của bạn với chúng tôi để thiết lập kết nối thời gian thực tức thì với các đầu mối khai báo hải quan cảng đích quốc tế.",
      fieldName: "Họ và Tên Của Bạn",
      fieldNamePl: "VD: Nguyễn Văn A (Trưởng Phòng Khai Thác Hải Quan)",
      fieldEmail: "Địa Chỉ Email Doanh Nghiệp",
      fieldEmailPl: "nguyenvana@forwarder.com.vn",
      fieldOrg: "Tên Doanh Nghiệp Logistics / Hợp Tác Xã",
      fieldOrgPl: "VD: Hợp tác xã Trái cây Sông Tiền / Forwarding JSC",
      fieldNote: "Chi tiết yêu cầu hoặc đặc thù nông sản xuất khẩu",
      fieldNotePl: "VD: Cần hỗ trợ khai báo khẩn cấp hệ thống CIFER Trung Quốc lệnh 248 cho 50 container thanh long sắp cập bến biên giới...",
      submitBtn: "Nộp Hồ Sơ Đăng Ký Kiểm Tác Khẩn Cấp",
      successTitle: "Yêu Cầu Cấp Phép Phòng Tuân Thủ Đã Ghi Nhận",
      requestId: "MÃ HỒ SƠ YÊU CẦU:",
      successDesc: "Cảm ơn {name}. Các chuyên gia rà soát rủi ro của Aegis Trade sẽ tiến hành lập hồ sơ đối chiếu tuân thủ cho {org} để khởi tạo cầu nối khai báo đặc quyền với hải quan cảng đích. Quá trình kiểm định tệp hồ sơ gốc mất khoảng 12 giờ làm việc thương mại tiêu chuẩn.",
      retryBtn: "Tạo hồ sơ xử lý hoặc liên lạc mới"
    },
    audio: {
      cursorActive: "Acoustic Cursor đang hoạt động",
      cursorMuted: "Âm thanh trỏ chuột",
      cursorHelp: "Hoạt ảnh Cursor Nhạc lý",
      audioGen: "Bộ phát âm thanh Pluck Synth",
      audioGenSub: "Phát âm thanh dựa trên vĩ độ chuột màn hình",
      muteBtn: "Tắt tiếng Cursor",
      activateBtn: "Khởi tạo âm thanh",
      closeBtn: "Đóng cửa sổ",
      description: "Di chuyển chuột của bạn trên khắp màn hình làm việc để tổng hợp những giai điệu ngũ âm tự nhiên. Tốc độ di chuyển, tọa độ ngang/dọc sẽ trực tiếp điều chỉnh cao độ, độ vang và bộ lọc thông tần của các nốt nhạc.",
      presetsTitle: "Bộ âm thanh nhạc lý:",
      presets: [
        {
          name: "Chuông Vàng Ngũ Âm (Golden Chimes)",
          desc: "Chuỗi âm thanh ngũ âm trong trẻo như tiếng khánh ngọc thanh tịnh."
        },
        {
          name: "Đàn Tranh Sông Hồng (Red River Harp)",
          desc: "Âm điệu du dương mộc mạc âm vang của dòng chảy phù sa miền sông nước."
        },
        {
          name: "Tiếng Vang Radar (Cyber Echoes)",
          desc: "Tín hiệu siêu âm điện tử lập lòe thiết kế chuyên biệt cho radar hàng hải."
        }
      ]
    },
    chat: {
      tag: "TRUY VẤN TRỰC TUYẾN AI",
      title: "Trợ Lý Hải Quan Aegis",
      welcomeMsg: "Xin kính chào quý khách vận tải Freight Forwarder. Tôi là Trợ Lý AI Aegis hỗ trợ rà soát biểu thuế nhập khẩu toàn cầu và rào cản kỹ thuật. Vui lòng cho biết chi tiết chứng từ hoặc loại nông sản bạn cần kiểm tra để tôi tiến hành tra cứu hệ thống luật.",
      presetsTitle: "Các câu hỏi mẫu tham khảo nhanh:",
      placeholder: "Ví dụ: Quy tắc dư lượng của Trung Quốc đối với vú sữa là gì?...",
      sendBtn: "Gửi câu hỏi",
      errorMsg: "Kết nối phân tích dữ liệu bị trì hoãn tạm thời. Cơ sở bộ nhớ trung tâm đang bận xử lý dòng mã. Xin vui lòng thử lại sau.",
      emptyMsg: "Cơ sở phân tích logic đang rỗng, máy chủ không trả lời. Xin vui lòng gửi mô tả chi tiết hơn.",
      presets: [
        "Tiêu chuẩn an toàn sinh học của FDA Mỹ đối với Cà phê Robusta Việt Nam là gì?",
        "Lệnh GACC 248 yêu cầu thủ tục CIFER gì đối với quả thanh long Bình Thuận?",
        "Giới hạn dư lượng hóa chất (MRL) nhập khẩu xoài tươi của Nhật Bản thế nào?"
      ]
    }
  },
  en: {
    nav: {
      platform: "Platform",
      solutions: "Solutions",
      insights: "Insights",
      regulations: "Regulations",
      manifesto: "Manifesto",
      contact: "Contact",
      launchCta: "Launch Platform",
      changeLanguageBtn: "🇻🇳 Tiếng Việt"
    },
    hero: {
      badge: "AI-POWERED EXPORT COMPLIANCE PLATFORM",
      title1: "Accelerating",
      title2: "Vietnamese Agriculture",
      title3: "to",
      title4: "global markets.",
      subtitle: "Streamline international customs workflows. Centralize sanitary & phytosanitary rules, extract document metadata instantly via OCR + GenAI, and detect filing anomalies in under 3 minutes.",
      triggerBtn: "Launch AI Validation Workspace",
      plansBtn: "Explore SaaS Plans",
      badge1: "Vietnam Customs Compliant",
      badge2: "Bilingual Extractor (EN/VN)",
      badge3: "GACC & FDA Portal Sync"
    },
    problem: {
      tag: "THE COLD SYSTEM BOTTLE-NECK",
      title: "The Border Gate Delay Crisis",
      desc1: "Vietnam’s fruit and agricultural export industry frequently experiences severe delays at international border gates. Physical inspection results, custom audits, and regulatory document processing take between 7 to 15 days.",
      desc2: "Each delay day compiles thousands in demurrage logistics costs and causes severe shelf-life deterioration, forcing farmers into unfavorable price outcomes when cargo rejects at international terminals.",
      desc3: "Aegis Trade eliminates the administrative drag by converting complex quarantine treaties, customs guidelines, and trade paperwork into verifiable computation files.",
      timelineTitle: "Performance Audit: Traditional vs. Aegis Logistics Route",
      modelTraditional: "Traditional Export Pipeline (7 - 15 Days Delay Bound)",
      modelAegis: "Aegis Trade Autonomous Pipeline (Under 3 Minutes Resolve)",
      stepPaperwork: "Physical Paperwork Audits",
      stepPaperworkDesc: "Disjointed cargo filing records, packing discrepancies, causing severe border stoppages.",
      stepQuarantine: "SPS Quarantine Lab Hold",
      stepQuarantineDesc: "Manual lab testing at borders waiting for biosecurity certification or quarantine stamps.",
      stepAudit: "Customs Manual Audit",
      stepAuditDesc: "Manual inspection of pesticide residual indices, creating massive administrative backlogs.",
      stepGate: "Border Gate Clearance",
      stepGateDesc: "Goods stack inside expensive cold containers waiting for physically wet signatures and red stamps.",
      stepAegisOcr: "AI Optical Doc Ingest",
      stepAegisOcrDesc: "OCR reads characters, checks seals, structures metadata from uploaded files on any mobile.",
      stepAegisQuery: "Cognitive MRL & SPS Query",
      stepAegisQueryDesc: "Queries FDA safety codes, China Decree 248 database, and Japan MRL registers.",
      stepAegisApproved: "Aegis Digital Passport",
      stepAegisApprovedDesc: "Perfect compliance match, cargo enters express clearance lane with immediate green seal."
    },
    workspace: {
      title: "Aegis Validation Suite",
      subtitle: "CYBERNETIC TRADE PARITY & EXPORT LICENSE VERIFIER v4.1",
      recentHistory: "Recent History",
      resetSystem: "Reset System",
      uploadTitle: "UPLOAD & VALIDATE DOCUMENT",
      chooseSample: "Select sample export document to simulate parsing:",
      dragDrop: "Drag and drop export files here, or click to browse",
      fileLimit: "Supports PDF, CSV, XLSX, PNG, and DOCX formats up to 45MB.",
      analyzingDoc: "Analyzing document structure and layout parity...",
      parsingDoc: "Extracting raw text database structure...",
      signatureOption: "Concentric signature/seal setting flag:",
      simulateUnsigned: "Simulate missing stamps / unsigned state",
      simulateSigned: "Simulate perfect signatures / certified seals",
      reportHeader: "COMPLIANCE VERIFICATION REPORT",
      complRatio: "Compliance Score",
      confidence: "HS Code Confidence",
      suggestedHs: "Suggested Harmonized System (HS) Code",
      destinationFit: "Destination Country Eligibility Fit",
      fitYes: "SECURE TREATY FIT APPROVED",
      fitNo: "CRITICAL FAILURE AGAINST TARIFF PROTOCOL",
      rawTextPreview: "AI Isolated Text Extraction Manifest:",
      issuesTitle: "IDENTIFIED EXPORT FLAWS & DISCREPANCIES (ACTION REQUIRED):",
      noIssues: "Pristine docket. No structural anomalies or regulatory violations spotted.",
      exportPdf: "Export Customs PDF Report",
      recentScansDrawer: "Recent Scans History (Client Cache)",
      sampleDocs: {
        dragon: "Binh Thuan Dragon Fruit to China (GACC)",
        coffee: "Dak Lak Robusta Coffee Bill of Lading (US FDA)",
        mango: "Cao Lanh Mango Quarantine Treaty (Japan MRL)"
      },
      complianceSteps: [
        "Analyzing document structure and layout parity...",
        "Extracting metadata (Sender, Recipient, Ports of transit)...",
        "Running HS-Code semantic grouping engine...",
        "Executing AI-based signature spotter and stamp validator...",
        "Querying global sanctions database (OFAC, EU Consolidated list)...",
        "Verifying bilaterial trade treaty allowances (FTA clearances)...",
        "Finalizing compliance score & structuring Aegis trade passport..."
      ],
      riskLevels: {
        high: "High Threat (Cargo Detention Risk)",
        medium: "Warning Flagged (Revision advised)",
        low: "Minor Notice"
      }
    },
    solutions: {
      tag: "SOVEREIGN REMEDIES & ARTIFACTS",
      title1: "Export",
      title2: "Compliance Solutions",
      subtitle: "Tailored software frameworks engineered directly to eliminate border gate processing stalls and bridge Vietnamese agricultural enterprises to global destinations.",
      triggerWorkflow: "Trigger AI verify mock workflow",
      items: [
        {
          title: "Centralized Regulation Hub",
          tag: "GLOBAL MATRIX DIRECTORY",
          desc: "Provides Vietnamese agrarian shippers with unified, simplified access to official customs policies, pesticide MRL limits, biosecurity certifications, and sanitary requirements in major global markets including the United States (FDA / FSMA), China (GACC Code 248), Japan, and South Korea. Eliminates blind manual research across disjointed foreign government databases."
        },
        {
          title: "OCR + GenAI Smart Extraction",
          tag: "COGNITIVE DOCUMENT INTERPRETER",
          desc: "Automates the ingest, structured translation, and character capture of crucial trade papers. Formulated specifically to parse Commercial Invoices, Packing Lists, Bills of Lading, Certificates of Origin (C/O), and phytosanitary quarantine records. Standardizes bilingual information arrays to isolate formatting flaws instantly."
        },
        {
          title: "AI Cross-Checking & Risk Detection",
          tag: "QUANTITATIVE RISK MONITOR",
          desc: "Runs multi-point validation algorithms to spot inconsistencies, weight mismatches, and chemical residue overages across files before cargo hits ports. Triggers clear, human-remediable alerts classified by gravity: 🟢 Approved, 🟡 Highlighted Warnings, or 🔴 Critical Compliance Failures."
        },
        {
          title: "SaaS Model & Local Payment Parity",
          tag: "B2B TRANSACTIONS LAYER",
          desc: "Empowers agricultural shippers of any scale with highly affordable subscriptions—Free, Weekly, Monthly, and Annual plans. Integrated with native, secure Vietnamese payment settlements including instant QR Banking transfers, MoMo, and ZaloPay, matching local agricultural trade styles perfectly."
        }
      ]
    },
    insights: {
      tag: "REAL-TIME TARIFF STATE UPDATES",
      title1: "Regulatory",
      title2: "Parity Intelligence",
      subtitle: "A live audited schedule of international trade rule changes, biosecurity closures, and cross-border customs declarations restrictions.",
      items: [
        {
          date: "May 26, 2026",
          source: "EUROPEAN CUSTOMS ASSOC.",
          status: "ACTIVE PROTOCOL",
          title: "Implementation of CBAM (Carbon Border Adjustment Mechanism) reporting guidelines",
          body: "Import declaration systems entering EU sea harbors must provide carbon emissions calculations verified by licensed third parties starting July 1st. Failure leads to general demurrage holds.",
          badge: "HIGH PARITY REQUIREMENT"
        },
        {
          date: "May 20, 2026",
          source: "JAPAN BIOSECURITY BOARD",
          status: "RESTRICTED",
          title: "Agricultural export inspection updates for grain shipments originating from Pacific Southeast",
          body: "Bacterial safety certificates for organic wheat and seed shipments must adhere to quarantine validation code FUM-90, extending inspection durations at Pacific ports by default.",
          badge: "AGRICULTURAL BIOMED"
        },
        {
          date: "May 15, 2026",
          source: "US HARMONIZATION DEP.",
          status: "AMENDMENT",
          title: "Revision of solar array tariff schedules under statutory trade rules",
          body: "Classification updates under sub-tier 8541.43 shift base duty ratios by clean-energy trade partner protocols. Immediate impact on freight forwarders managing bulk distribution centers.",
          badge: "CLEAN ENERGY TARIFFS"
        }
      ]
    },
    manifesto: {
      tag: "AEGIS TRADE TREATISE",
      title1: "The Manifesto for",
      title2: "Frictionless Sovereignty",
      subtitle: "Stating our system philosophy and structural vision for the future of sovereign global supply chains and cross-border digital compliance.",
      problemTitle: "The Problem of Modern Trade Friction",
      problemDesc1: "Today, merchant fleets crossing international blue-water lanes travel faster than the documentation required to clear their landing. A shipping vessel container departs ports under digital manifests, only to stall at receiving terminals for days awaiting phytosanitary certifications, trade partner verification, and manual HS classification auditing.",
      problemDesc2: "This friction is not caused by lack of transit velocity, but by an assembly of siloed regulatory matrices. Physical custom holds represent billions in capital inefficiency, impacting independent agricultural producers, electronics supply nodes, and high-precision manufacturers alike.",
      philosophyTitle: "The Philosophy: Computational Parity",
      philosophyDesc: "We assert that trade regulations are not inherently subjective barriers, but standard logical protocols. By formulating tariff schedules, embargo parameters, biosecurity registers, and ECCN classifications as computable statement parameters, we can instantiate computational parity. Under this paradigm, every export document can be automatically resolved and proven secure in a fraction of a second.",
      pillarsTitle: "The Three Pillars of Our Vision",
      pillar1Tag: "PILLAR I",
      pillar1Title: "Autonomous Parity",
      pillar1Desc: "Every customs regulatory code, phytosanitary restriction, and tariff index should live as a live, open, programmable endpoint rather than static paper registers.",
      pillar2Tag: "PILLAR II",
      pillar2Title: "Encrypted Corridors",
      pillar2Desc: "Bilateral trade integrity is a sovereign resource. We build encrypted validations that protect commercial formulas and proprietary supplier details while proving compliance.",
      pillar3Tag: "PILLAR III",
      pillar3Title: "Universal Agency",
      pillar3Desc: "Frictionless clearance shouldn't belong solely to trillion-dollar conglomerates. We democratize custom compliance tools so any local regional exporter can secure fast-tracks.",
      joinTitle: "Join the Computational Parity Initiative",
      joinDesc: "Signify your organization's alignment with autonomous, high-velocity trade.",
      partnerBtn: "Partner with AegisTrade"
    },
    contact: {
      tag: "SECURE PARITY COMMUNICATIONS",
      title: "Request Priority Trade Clearance",
      subtitle: "Register your compliance department to instantiate real-time automated API hooks and secure priority clearance on customs transit lines.",
      fieldName: "Your Full Name",
      fieldNamePl: "Consignee Officer / Import Manager",
      fieldEmail: "Enterprise Correspondence Email",
      fieldEmailPl: "officer@globalcommerce.com",
      fieldOrg: "Registered Trading Organization",
      fieldOrgPl: "Pacific Agricultural Exporters Inc.",
      fieldNote: "Regulatory Note / Inquiry Depth (Optional)",
      fieldNotePl: "Provide details about standard bulk cargo types, ports of departure, or existing systems integration requirements...",
      submitBtn: "Submit Secure Clearance Application",
      successTitle: "Clearance Registered Securely",
      requestId: "REQUEST ID:",
      successDesc: "Thank you {name}. Aegis security auditors will review {org} compliance profile for preferential customs transit hooks. Initial evaluation takes exactly 12 standard commercial hours.",
      retryBtn: "Process another clearance registration"
    },
    audio: {
      cursorActive: "Cursor: acoustic feedback is active",
      cursorMuted: "Musical Cursor",
      cursorHelp: "Interactive Acoustic Tracker",
      audioGen: "Audio Generator",
      audioGenSub: "Real-time coordinate Pluck Synth",
      muteBtn: "Mute Cursor",
      activateBtn: "Activate Engine",
      closeBtn: "Close",
      description: "Move your mouse across the workspace screen to synthesize beautiful pentatonic melodies in real-time. Speed, horizontal coordinates, and vertical elevation map to active note selection, decay, and filters.",
      presetsTitle: "Select scales preset:",
      presets: [
        {
          name: "Golden Chimes",
          desc: "Crystalline pentatonic bell tones mapped to the horizontal horizon."
        },
        {
          name: "Red River Harp",
          desc: "Mysterious wind melody loops with warm resonant reflections."
        },
        {
          name: "Cyber Echoes",
          desc: "Dual wave frequency blips custom-made for spatial radar layouts."
        }
      ]
    },
    chat: {
      tag: "SOVEREIGN AI CHAT",
      title: "Aegis Oracle Agent",
      welcomeMsg: "Good day. I am the Aegis Trade AI Oracle, your sovereign compliance and global tariff intelligence assistant. Please state your regulatory inquiry, and I shall query the compliance matrices for you.",
      presetsTitle: "Frequent Inquiry Presets:",
      placeholder: "State your compliance or agricultural trade inquiry here...",
      sendBtn: "Send Ticket",
      errorMsg: "We regret to inform you that a connectivity disruption has occurred. Our compliance matrices are momentarily unreachable. Please verify your system environment or coordinate with your network administrator.",
      emptyMsg: "Indeed, our analytical engines returned an empty register.",
      presets: [
        "Explain FDA biosecurity standards for Vietnamese Robusta Coffee exports.",
        "Detail GACC registration Code 248 requirements for dragon fruits to China.",
        "What are Japan's Pesticide Residue MRL limits for Fresh Mango imports?"
      ]
    }
  }
};
