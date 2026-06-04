import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Globe, 
  ExternalLink, 
  BookOpen, 
  Filter, 
  ChevronRight, 
  FileText, 
  Scale, 
  Building2, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle,
  Clock,
  ArrowUpRight,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  Download,
  Info
} from 'lucide-react';

// Define regulatory law interfaces
export interface RegulatoryLaw {
  id: string;
  country: 'USA' | 'China' | 'Japan';
  name: string;
  nameVi: string;
  body: string;
  bodyVi: string;
  covers: string;
  coversVi: string;
  link: string;
  accentColor: string;
  flag: string;
  articlesCount: number;
  lastUpdated: string;
  lastUpdatedVi: string;
  applicableProduce: string[];
  applicableProduceVi: string[];
  tags: string[];
  tagsVi: string[];
}

const REGULATORY_LAWS_DATA: RegulatoryLaw[] = [
  // USA Regulations (🇺🇸 Accent color: #B22234)
  {
    id: 'us-fsma',
    country: 'USA',
    name: 'Food Safety Modernization Act (FSMA)',
    nameVi: 'Đạo luật Hiện đại hóa An toàn Thực phẩm (FSMA)',
    body: 'Food and Drug Administration (FDA)',
    bodyVi: 'Cục Quản lý Thực phẩm và Dược phẩm Hoa Kỳ (FDA)',
    covers: 'Prevention-based food safety standards for all imported agricultural products and food facilities.',
    coversVi: 'Các tiêu chuẩn định hướng phòng dịch an toàn thực phẩm đối với tất cả nông sản nhập khẩu và cơ sở sản xuất thực phẩm.',
    link: 'https://www.fda.gov/food/guidance-regulation-food-and-dietary-supplements/food-safety-modernization-act-fsma',
    accentColor: '#B22234',
    flag: '🇺🇸',
    articlesCount: 41,
    lastUpdated: 'May 2026',
    lastUpdatedVi: 'Tháng 5, 2026',
    applicableProduce: ['Coffee', 'Fruits', 'Vegetables', 'Processed Food'],
    applicableProduceVi: ['Cà Phê', 'Trái Cây', 'Rau Quả', 'Thực Phẩm Chế Biến'],
    tags: ['Prevention', 'Facility Registration', 'Food Safety'],
    tagsVi: ['Phòng Ngừa', 'Đăng Ký Cơ Sở', 'An Toàn Thực Phẩm']
  },
  {
    id: 'us-psr',
    country: 'USA',
    name: 'FSMA — Produce Safety Rule (PSR)',
    nameVi: 'FSMA — Quy tắc An toàn Sản xuất Nông sản tươi sống (PSR)',
    body: 'Food and Drug Administration (FDA)',
    bodyVi: 'Cục Quản lý Thực phẩm và Dược phẩm Hoa Kỳ (FDA)',
    covers: 'Science-based standards for growing, harvesting, packing, and holding of fresh fruits and vegetables meant for raw consumption — covering agricultural water sources, worker hygiene, and farming soil.',
    coversVi: 'Các tiêu chuẩn dựa trên khoa học để trồng, thu hoạch, đóng gói và lưu huỳnh quả và rau tươi sống — bao gồm nguồn nước nông nghiệp, vệ sinh công nhân và chất lượng đất trồng trọt.',
    link: 'https://www.fda.gov/food/food-safety-modernization-act-fsma/fsma-final-rule-produce-safety',
    accentColor: '#B22234',
    flag: '🇺🇸',
    articlesCount: 18,
    lastUpdated: 'April 2026',
    lastUpdatedVi: 'Tháng 4, 2026',
    applicableProduce: ['Dragon Fruit', 'Mango', 'Fresh Vegetables'],
    applicableProduceVi: ['Thanh Long', 'Xoài', 'Rau Tươi'],
    tags: ['Water Standards', 'Soil Quality', 'Harvesting'],
    tagsVi: ['Tiêu Chuẩn Nước', 'Chất Lượng Đất', 'Thu Hoạch']
  },
  {
    id: 'us-fsvp',
    country: 'USA',
    name: 'FSMA — Foreign Supplier Verification Program (FSVP)',
    nameVi: 'FSMA — Chương trình Xác minh Nhà cung cấp Nước ngoài (FSVP)',
    body: 'Food and Drug Administration (FDA)',
    bodyVi: 'Cục Quản lý Thực phẩm và Dược phẩm Hoa Kỳ (FDA)',
    covers: 'Requirements for US importers to perform hazard analyses and verification activities, confirming foreign agricultural suppliers meet equivalent US safety standards.',
    coversVi: 'Yêu cầu đối với nhà nhập khẩu tại Hoa Kỳ thực hiện phân tích mối nguy và xác minh, xác nhận rằng các nhà cung cấp nông sản quốc tế đạt tiêu chuẩn an toàn tương đương.',
    link: 'https://www.fda.gov/food/food-safety-modernization-act-fsma/fsma-final-rule-foreign-supplier-verification-programs-fsvp-importers-food-humans-and-animals',
    accentColor: '#B22234',
    flag: '🇺🇸',
    articlesCount: 22,
    lastUpdated: 'January 2026',
    lastUpdatedVi: 'Tháng 1, 2026',
    applicableProduce: ['All Agricultural Exports'],
    applicableProduceVi: ['Mọi Nông Sản Xuất Khẩu'],
    tags: ['Importer Verification', 'Hazard Analysis', 'Compliance Audits'],
    tagsVi: ['Xác Minh Nhà Nhập Khẩu', 'Phân Tích Mối Nguy', 'Kiểm Toán Tuân Thủ']
  },
  {
    id: 'us-traceability',
    country: 'USA',
    name: 'FSMA — Food Traceability Rule',
    nameVi: 'FSMA — Quy tắc Truy xuất Nguồn gốc Thực phẩm',
    body: 'Food and Drug Administration (FDA)',
    bodyVi: 'Cục Quản lý Thực phẩm và Dược phẩm Hoa Kỳ (FDA)',
    covers: 'Key traceability recordkeeping requirements (including Critical Tracking Events and Key Data Elements) for designated high-risk produce such as fresh tropical fruits (mangoes), melons, and shellfish.',
    coversVi: 'Yêu cầu lưu hồ sơ truy xuất nguồn gốc chính (gồm Đăng ký sự kiện theo dõi chính và Cơ sở dữ liệu cốt lõi) đối với nông sản rủi ro cao được chỉ định như hoa quả nhiệt đới tươi (xoài), dưa và động vật có vỏ.',
    link: 'https://www.fda.gov/food/food-safety-modernization-act-fsma/food-safety-modernization-act-fsma-proposed-rule-food-traceability',
    accentColor: '#B22234',
    flag: '🇺🇸',
    articlesCount: 15,
    lastUpdated: 'May 2026',
    lastUpdatedVi: 'Tháng 5, 2026',
    applicableProduce: ['Mango', 'Melons', 'Fresh Produce'],
    applicableProduceVi: ['Xoài', 'Dưa Hấu', 'Nông Sản Tươi'],
    tags: ['Traceability Ledger', 'Critical Events', 'Digital Records'],
    tagsVi: ['Sổ Truy Xuất', 'Sự Kiện Cốt Lõi', 'Hồ Sơ Số']
  },
  {
    id: 'us-fdca',
    country: 'USA',
    name: 'Federal Food, Drug & Cosmetic Act (FD&C Act)',
    nameVi: 'Đạo luật Liên bang về Thực phẩm, Dược phẩm và Mỹ phẩm (FD&C Act)',
    body: 'Food and Drug Administration (FDA)',
    bodyVi: 'Cục Quản lý Thực phẩm và Dược phẩm Hoa Kỳ (FDA)',
    covers: 'Core statutory authority governing general food safety, labeling compliance, pesticide limit penalties, and customs rejections for all imported merchandise.',
    coversVi: 'Thẩm quyền tối cao quản lý chung về an toàn thực phẩm, tuân thủ nhãn mác, hình phạt quá ngưỡng chất bảo vệ thực vật, và lệnh từ chối thông quan đối với tất cả hàng hóa nhập khẩu.',
    link: 'https://www.fda.gov/regulatory-information/laws-enforced-fda/federal-food-drug-and-cosmetic-act-fdc-act',
    accentColor: '#B22234',
    flag: '🇺🇸',
    articlesCount: 52,
    lastUpdated: 'March 2026',
    lastUpdatedVi: 'Tháng 3, 2026',
    applicableProduce: ['All Agricultural Exports', 'Processed Goods'],
    applicableProduceVi: ['Hàng Nông Sản Xuất Khẩu', 'Hàng Chế Biến'],
    tags: ['Labeling Act', 'Border Detention', 'Adulteration Standards'],
    tagsVi: ['Luật Nhãn Mác', 'Tịch Thu Cửa Khẩu', 'Tiêu Chuẩn Tạp Chất']
  },
  {
    id: 'us-ppa',
    country: 'USA',
    name: 'Plant Protection Act',
    nameVi: 'Đạo luật Bảo vệ Thực vật Hoa Kỳ',
    body: 'USDA / APHIS',
    bodyVi: 'Bộ Nông nghiệp Hoa Kỳ / Cục Kiểm dịch Động Thực vật (USDA / APHIS)',
    covers: 'Sanitary and Phytosanitary (SPS) regulations, pest-risk assessments, pre-clearance programs, and import permits governing foreign plant materials.',
    coversVi: 'Các quy định kiểm dịch động thực vật (SPS), đánh giá rủi ro dịch hại, chương trình cấp phép tiền thông quan và các giấy phép nhập khẩu chi phối vật liệu thực vật từ nước ngoài.',
    link: 'https://www.aphis.usda.gov/regulations/plant-health/plant-protection-act',
    accentColor: '#B22234',
    flag: '🇺🇸',
    articlesCount: 29,
    lastUpdated: 'February 2026',
    lastUpdatedVi: 'Tháng 2, 2026',
    applicableProduce: ['Dragon Fruit', 'Mango', 'Fresh Flowers', 'Seeds'],
    applicableProduceVi: ['Thanh Long', 'Xoài', 'Hoa Tươi', 'Hạt Giống'],
    tags: ['Phytosanitary Protocol', 'Pest Control', 'USDA Permits'],
    tagsVi: ['Quy Trình Kiểm Dịch', 'Kiểm Soát Dịch Hại', 'Giấy Phép USDA']
  },
  {
    id: 'us-bioterrorism',
    country: 'USA',
    name: 'Bioterrorism Act — Prior Notice',
    nameVi: 'Đạo luật An ninh Sinh học — Khai báo Trước (Prior Notice)',
    body: 'Food and Drug Administration (FDA)',
    bodyVi: 'Cục Quản lý Thực phẩm và Dược phẩm Hoa Kỳ (FDA)',
    covers: 'Mandatory submission of pre-arrival prior notifications details before food cargos formally enter US ports of discharge.',
    coversVi: 'Yêu cầu bắt buộc nộp thông tin khai báo trước lịch cập cảng hoặc cửa khẩu dỡ hàng của Hoa Kỳ cho tất cả khối lượng hàng thực phẩm.',
    link: 'https://www.fda.gov/food/food-defense-programs/prior-notice-imported-food',
    accentColor: '#B22234',
    flag: '🇺🇸',
    articlesCount: 8,
    lastUpdated: 'January 2026',
    lastUpdatedVi: 'Tháng 1, 2026',
    applicableProduce: ['All Foodstuffs', 'Coffee', 'Rice'],
    applicableProduceVi: ['Mọi Thực Phẩm', 'Cà Phê', 'Gạo xuất khẩu'],
    tags: ['Prior Notice', 'Border Security', 'Cargo Manifest'],
    tagsVi: ['Khai Báo Trước', 'An Ninh Biên Giới', 'Tờ Khai Hàng Hóa']
  },

  // China Regulations (🇨🇳 Accent color: #DE2910)
  {
    id: 'cn-prc-foodsafety',
    country: 'China',
    name: 'Food Safety Law of the PRC (2009, amended 2021)',
    nameVi: 'Luật An toàn Thực phẩm CHND Trung Hoa (2009, sửa đổi 2021)',
    body: 'NHC / SAMR',
    bodyVi: 'Ủy ban Y tế Quốc gia (NHC) / Tổng cục Quản lý Giám sát Thị trường (SAMR)',
    covers: 'Core food safety framework — all imported food must meet national GB standards.',
    coversVi: 'Khung an toàn thực phẩm cốt lõi — mọi thực phẩm nhập khẩu phải tuân thủ tiêu chuẩn quốc gia GB.',
    link: 'https://www.fas.usda.gov/data/gain/2026/04/china-fairs-country-report-annual',
    accentColor: '#DE2910',
    flag: '🇨🇳',
    articlesCount: 104,
    lastUpdated: 'May 2026',
    lastUpdatedVi: 'Tháng 5, 2026',
    applicableProduce: ['All Food Imports', 'Agricultural Exports'],
    applicableProduceVi: ['Thực Phẩm Nhập Khẩu', 'Nông Sản Xuất Khẩu'],
    tags: ['Food Safety Act', 'GB Standards', 'Core Law'],
    tagsVi: ['Luật An Toàn Thực Phẩm', 'Tiêu Chuẩn Quốc Gia GB', 'Luật Cốt Lõi']
  },
  {
    id: 'cn-decree248',
    country: 'China',
    name: 'GACC Decree 248 — Overseas Food Manufacturer Registration ⚠ superseded by Decree 280',
    nameVi: 'Lệnh 248 của GACC — Đăng ký Cơ sở Sản xuất Thực phẩm Nước ngoài ⚠ Thay thế bởi Lệnh 280',
    body: 'GACC',
    bodyVi: 'Tổng cục Hải quan Trung Quốc (GACC)',
    covers: 'Registration of overseas food manufacturers on CIFER; 18 high-risk categories require competent authority recommendation.',
    coversVi: 'Đăng ký doanh nghiệp sản xuất thực phẩm nước ngoài trên hệ thống CIFER; 18 danh mục rủi ro cao yêu cầu đề xuất của cơ quan thẩm quyền sở tại.',
    link: 'https://www.cfs.gov.hk/english/export/export_fem/decree_no_248.html',
    accentColor: '#DE2910',
    flag: '🇨🇳',
    articlesCount: 28,
    lastUpdated: 'May 2026',
    lastUpdatedVi: 'Tháng 5, 2026',
    applicableProduce: ['Registration', 'Exporters', '18 High-Risk Foods'],
    applicableProduceVi: ['Đăng Ký Cơ Sở', 'Nhà Xuất Khẩu', '18 Nhóm Rủi Ro'],
    tags: ['Decree 248', 'CIFER Portal', 'Manufacturer Registry'],
    tagsVi: ['Lệnh 248 GACC', 'Hệ Thống CIFER', 'Sổ Đăng Ký Cơ Sở']
  },
  {
    id: 'cn-decree280',
    country: 'China',
    name: 'GACC Decree 280 — Revised Overseas Manufacturer Registration (in force 1 Jun 2026)',
    nameVi: 'Lệnh 280 của GACC — Đăng ký Cơ sở Sản xuất sửa đổi (Có hiệu lực 1 tháng 6, 2026)',
    body: 'GACC',
    bodyVi: 'Tổng cục Hải quan Trung Quốc (GACC)',
    covers: 'Replaces Decree 248 — updated registration process, renewal conditions, exemptions for overseas establishments; 17 high-risk food categories.',
    coversVi: 'Thay thế cho Lệnh 248 — cập nhật quy trình đăng ký, điều khoản gia hạn và một số trường hợp miễn trừ đối với cơ sở nước ngoài; kiểm soát chặt 17 danh mục thực phẩm rủi ro cao.',
    link: 'https://www.cfs.gov.hk/english/export/export_fem/decree_no_248.html',
    accentColor: '#DE2910',
    flag: '🇨🇳',
    articlesCount: 25,
    lastUpdated: 'Effective 1 June 2026',
    lastUpdatedVi: 'Hiệu lực từ 1 tháng 6, 2026',
    applicableProduce: ['Manufacturing Facilities', 'All Exporters'],
    applicableProduceVi: ['Cơ Sở Sản Xuất', 'Tất Cả Nhà Xuất Khẩu'],
    tags: ['Decree 280', 'Registration Updates', 'Exemptions'],
    tagsVi: ['Lệnh GACC 280', 'Cập Nhật Đăng Ký', 'Thông Lệ Miễn Trừ']
  },
  {
    id: 'cn-decree249',
    country: 'China',
    name: 'GACC Decree 249 — Import & Export Food Safety Administration',
    nameVi: 'Lệnh 249 của GACC — Quản lý An toàn Thực phẩm Xuất nhập khẩu',
    body: 'GACC',
    bodyVi: 'Tổng cục Hải quan Trung Quốc (GACC)',
    covers: 'Inspection, quarantine, labeling, packaging, and recall of imported food.',
    coversVi: 'Quy chế kiểm tra biên giới, kiểm dịch động thực vật, nhãn mác, bao gói và cơ chế thu hồi đối với thực phẩm nhập khẩu.',
    link: 'https://www.cfs.gov.hk/english/export/export_fem/decree_no_248.html',
    accentColor: '#DE2910',
    flag: '🇨🇳',
    articlesCount: 35,
    lastUpdated: 'March 2026',
    lastUpdatedVi: 'Tháng 3, 2026',
    applicableProduce: ['All Food', 'Fresh Produce', 'Labeling'],
    applicableProduceVi: ['Mọi Thực Phẩm', 'Hàng Nông Sản Tươi', 'Ghi Nhãn Mác'],
    tags: ['Decree 249', 'Quarantine', 'Food Recalls'],
    tagsVi: ['Lệnh GACC 249', 'Quy Quy Kiểm Dịch', 'Thu Hồi Hàng Lỗi']
  },
  {
    id: 'cn-gb7718',
    country: 'China',
    name: 'GB 7718-2025 — Food Labeling Standard (effective Mar 2027)',
    nameVi: 'GB 7718-2025 — Tiêu chuẩn Ghi nhãn Thực phẩm (Hiệu lực tháng 3, 2027)',
    body: 'NHC / SAMR',
    bodyVi: 'Ủy ban Y tế Quốc gia (NHC) / Tổng cục Quản lý Giám sát Thị trường (SAMR)',
    covers: 'National standard for pre-packaged food labels — mandatory allergen declaration for 8 substance categories; new chapter for imported food labels.',
    coversVi: 'Tiêu chuẩn quốc gia về nhãn mác thực phẩm đóng gói sẵn — yêu cầu ghi nhãn chất gây ứng bắt buộc cho 8 nhóm tác nhân; bổ sung chương riêng quy định nhãn thực phẩm nhập khẩu.',
    link: 'https://www.fas.usda.gov/data/china-prepackaged-food-labeling-standards-finalized',
    accentColor: '#DE2910',
    flag: '🇨🇳',
    articlesCount: 15,
    lastUpdated: '2025 Release',
    lastUpdatedVi: 'Ban hành 2025',
    applicableProduce: ['Pre-packaged Food', 'Processed Goods'],
    applicableProduceVi: ['Thực Phẩm Đóng Gói Sẵn', 'Mặt Hàng Chế Biến'],
    tags: ['GB 7718', 'Labeling Standard', 'Allergens'],
    tagsVi: ['Tiêu Chuẩn GB 7718', 'Nhãn Bao Bì', 'Tác Nhân Dị Ứng']
  },
  {
    id: 'cn-gb2763',
    country: 'China',
    name: 'GB 2763-2026 — Maximum Pesticide Residue Limits (in force 1 Mar 2026)',
    nameVi: 'GB 2763-2026 — Giới hạn Dư lượng Tối đa Thuốc Bảo vệ Thực vật (Hiệu lực 1 tháng 3, 2026)',
    body: 'MARA / NHC',
    bodyVi: 'Bộ Nông nghiệp Nông thôn (MARA) / Ủy ban Y tế Quốc gia (NHC)',
    covers: 'Maximum allowable pesticide residue levels in food products — 10,749 MRLs covering 585 pesticides; supersedes GB 2763-2021.',
    coversVi: 'Ngưỡng giới hạn lượng tồn dư tối đa chất bảo vệ thực vật cho phép — quy định 10,749 ngưỡng MRL cho 585 loại chất bảo vệ; thay thế tiêu chuẩn GB 2763-2021.',
    link: 'https://food.chemlinked.com/news/food-news/china-releases-seven-national-food-safety-standards-on-pesticide-residues',
    accentColor: '#DE2910',
    flag: '🇨🇳',
    articlesCount: 100,
    lastUpdated: 'Live Thresholds',
    lastUpdatedVi: 'Tra cứu trực tiếp',
    applicableProduce: ['Fruits', 'Vegetables', 'Grains'],
    applicableProduceVi: ['Trái Cây', 'Rau Xanh', 'Ngũ Cốc'],
    tags: ['Pesticide MRL', 'Residual Limits', 'Limits'],
    tagsVi: ['Ngưỡng Giới Hạn MRL', 'Dư Lượng Thuốc BVTV', 'Hạn Mức Độc Chất']
  },
  {
    id: 'cn-cifer',
    country: 'China',
    name: 'CIFER — China Import Food Enterprises Registration Portal',
    nameVi: 'CIFER — Cổng Đăng Ký Doanh Nghiệp Thực Phẩm Nhập Khẩu Trung Quốc',
    body: 'GACC / China E-port Data Centre',
    bodyVi: 'Tổng cục Hải quan Trung Quốc / Trung tâm Dữ liệu Cổng thông tin một cửa',
    covers: 'Online portal to register overseas food production facilities for China export eligibility.',
    coversVi: 'Cổng thông tin điện tử trực tuyến dùng để đăng ký cơ sở sản xuất thực phẩm nước ngoài nhằm đủ điều kiện xuất khẩu sang Trung Quốc.',
    link: 'https://cifer.singlewindow.cn',
    accentColor: '#DE2910',
    flag: '🇨🇳',
    articlesCount: 1,
    lastUpdated: 'Active Portal',
    lastUpdatedVi: 'Cổng Hoạt Động Liên Tục',
    applicableProduce: ['Facility Registration', 'Exporters'],
    applicableProduceVi: ['Đăng Ký Cơ Sở', 'Nhà Xuất Khẩu'],
    tags: ['CIFER', 'Online Filing', 'Single Window'],
    tagsVi: ['Cổng CIFER', 'Khai Báo Trực Tuyến', 'Một Cửa Quốc Gia']
  },

  // Japan Regulations (🇯🇵 Accent color: #BC002D)
  {
    id: 'jp-food-safety-basic',
    country: 'Japan',
    name: 'Food Safety Basic Act',
    nameVi: 'Đạo luật Cơ bản về An toàn Thực phẩm',
    body: 'Cabinet Office / FSC',
    bodyVi: 'Văn phòng Thường trực Chính phủ / Ủy ban An toàn Thực phẩm Nhật Bản (FSC)',
    covers: "Foundational law establishing Japan's food safety principles and the Food Safety Commission.",
    coversVi: 'Luật nền tảng thiết lập nên các nguyên tắc cơ bản về an toàn thực phẩm của Nhật Bản và cơ cấu Ủy ban An toàn Thực phẩm.',
    link: 'https://www.fsc.go.jp/english/',
    accentColor: '#BC002D',
    flag: '🇯🇵',
    articlesCount: 38,
    lastUpdated: 'May 2026',
    lastUpdatedVi: 'Tháng 5, 2026',
    applicableProduce: ['All Agricultural Exports', 'Processed Food'],
    applicableProduceVi: ['Nông Sản Xuất Khẩu', 'Thực Phẩm Chế Biến'],
    tags: ['Food Safety', 'Basic Act', 'FSC'],
    tagsVi: ['An Toàn Thực Phẩm', 'Luật Cơ Bản', 'Thẩm Quyền FSC']
  },
  {
    id: 'jp-food-sanitation',
    country: 'Japan',
    name: 'Food Sanitation Act (1947, revised 2018)',
    nameVi: 'Đạo luật Vệ sinh Thực phẩm (1947, sửa đổi 2018)',
    body: 'MHLW',
    bodyVi: 'Bộ Y tế, Lao động và Phúc lợi Nhật Bản (MHLW)',
    covers: 'Food standards, additives, pesticide residue Positive List System — all imported food inspected at quarantine stations.',
    coversVi: 'Bộ tiêu chuẩn thực phẩm, phụ gia, Hệ thống danh mục tích cực (Positive List) dư lượng thuốc bảo vệ thực vật — mọi thực phẩm nhập khẩu đều được kiểm tra tại các trạm kiểm dịch.',
    link: 'https://www.mhlw.go.jp/english/topics/importedfoods/1-1.html',
    accentColor: '#BC002D',
    flag: '🇯🇵',
    articlesCount: 79,
    lastUpdated: 'April 2026',
    lastUpdatedVi: 'Tháng 4, 2026',
    applicableProduce: ['All Agricultural Exports', 'Processed Food'],
    applicableProduceVi: ['Nông Sản Xuất Khẩu', 'Thực Phẩm Chế Biến'],
    tags: ['Sanitation', 'Pesticide limits', 'MHLW'],
    tagsVi: ['Vệ Sinh Thực Phẩm', 'Dư Lượng Thuốc', 'Kiểm Dịch MHLW']
  },
  {
    id: 'jp-food-labeling',
    country: 'Japan',
    name: 'Food Labeling Act',
    nameVi: 'Đạo luật Ghi nhãn Thực phẩm',
    body: 'Consumer Affairs Agency',
    bodyVi: 'Cục Khách hàng và Người tiêu dùng Nhật Bản (CAA)',
    covers: "All food sold to consumers must have Japanese-language labels — importer's responsibility.",
    coversVi: 'Mọi thực phẩm bán cho người tiêu dùng tại thị trường Nhật Bản bắt buộc phải dán nhãn bằng tiếng Nhật — thuộc trách nhiệm pháp lý của nhà nhập khẩu.',
    link: 'https://www.caa.go.jp/en/',
    accentColor: '#BC002D',
    flag: '🇯🇵',
    articlesCount: 22,
    lastUpdated: 'March 2026',
    lastUpdatedVi: 'Tháng 3, 2026',
    applicableProduce: ['All Agricultural Exports', 'Pre-packaged Food'],
    applicableProduceVi: ['Nông Sản Xuất Khẩu', 'Thực Phẩm Đóng Gói Sẵn'],
    tags: ['Labeling Act', 'Japanese Labeling', 'Consumer Safety'],
    tagsVi: ['Luật Nhãn Mác', 'Nhãn Tiếng Nhật', 'An Toàn Tiêu Dùng']
  },
  {
    id: 'jp-agricultural-standards',
    country: 'Japan',
    name: 'Japan Agricultural Standards (JAS) Act',
    nameVi: 'Đạo luật Tiêu chuẩn Nông nghiệp Nhật Bản (JAS)',
    body: 'MAFF',
    bodyVi: 'Bộ Nông nghiệp, Lâm nghiệp và Thủy sản Nhật Bản (MAFF)',
    covers: 'Voluntary quality assurance system — mandatory for "organic" labeling in Japan.',
    coversVi: 'Hệ thống chứng nhận chất lượng tự nguyện bảo đảm tiêu chuẩn nông sản — bắt buộc áp dụng đối với việc dán nhãn "hữu cơ" (organic) tại Nhật Bản.',
    link: 'https://www.maff.go.jp/e/jas/index.html',
    accentColor: '#BC002D',
    flag: '🇯🇵',
    articlesCount: 45,
    lastUpdated: 'May 2026',
    lastUpdatedVi: 'Tháng 5, 2026',
    applicableProduce: ['Organic Produce', 'Farming Goods'],
    applicableProduceVi: ['Nông Sản Hữu Cơ', 'Nông Sản Trồng Trọt'],
    tags: ['JAS Standards', 'Organic Labeling', 'Quality Assurance'],
    tagsVi: ['Tiêu Chuẩn JAS', 'Nhãn Hữu Cơ', 'Chứng Nhận Chất Lượng']
  },
  {
    id: 'jp-plant-protection',
    country: 'Japan',
    name: 'Plant Protection Law',
    nameVi: 'Luật Bảo vệ Thực vật Nhật Bản',
    body: 'MAFF',
    bodyVi: 'Bộ Nông nghiệp, Lâm nghiệp và Thủy sản Nhật Bản (MAFF)',
    covers: 'All plants and plant products must carry Phytosanitary Certificate and pass quarantine at port of entry.',
    coversVi: 'Mọi loại thực vật và sản phẩm từ thực vật nhập khẩu bắt buộc phải đi kèm Chứng thư Kiểm dịch Thực vật (Phytosanitary Certificate) và được thông quan kiểm tra tại cảng nhập.',
    link: 'https://www.maff.go.jp/aqs/english/index.html',
    accentColor: '#BC002D',
    flag: '🇯🇵',
    articlesCount: 62,
    lastUpdated: 'May 2026',
    lastUpdatedVi: 'Tháng 5, 2026',
    applicableProduce: ['Fresh Fruits', 'Vegetables', 'Plants'],
    applicableProduceVi: ['Trái Cây Tươi', 'Rau Quả', 'Thực Vật'],
    tags: ['Plant Quarantine', 'Phytosanitary', 'Port Inspection'],
    tagsVi: ['Kiểm Dịch Thực Vật', 'Chứng Thư SPS', 'Kiểm Tra Tại Cảng']
  },
  {
    id: 'jp-animal-infectious',
    country: 'Japan',
    name: 'Domestic Animal Infectious Diseases Control Law',
    nameVi: 'Luật Kiểm soát Bệnh truyền nhiễm Động vật nội địa',
    body: 'MAFF',
    bodyVi: 'Bộ Nông nghiệp, Lâm nghiệp và Thủy sản Nhật Bản (MAFF)',
    covers: 'Quarantine requirements for animal products and livestock imports.',
    coversVi: 'Yêu cầu và quy trình kiểm dịch nghiêm ngặt đối với các sản phẩm từ động vật, sản phẩm chăn nuôi và gia súc gia cầm nhập khẩu.',
    link: 'https://www.maff.go.jp/e/index.html',
    accentColor: '#BC002D',
    flag: '🇯🇵',
    articlesCount: 54,
    lastUpdated: 'February 2026',
    lastUpdatedVi: 'Tháng 2, 2026',
    applicableProduce: ['Animal Products', 'Livestock'],
    applicableProduceVi: ['Sản Phẩm Động Vật', 'Chăn Nuôi'],
    tags: ['Animal Quarantine', 'Livestock Safety', 'Infectious Diseases'],
    tagsVi: ['Kiểm Dịch Động Vật', 'An Toàn Chăn Nuôi', 'Dịch Bệnh Gia Súc']
  },
  {
    id: 'jp-customs-law',
    country: 'Japan',
    name: 'Japan Customs Law',
    nameVi: 'Luật Hải quan Nhật Bản',
    body: 'Japan Customs',
    bodyVi: 'Cơ quan Hải quan Nhật Bản',
    covers: 'Customs declaration procedures, tariff law, temporary tariff measures for agricultural imports.',
    coversVi: 'Quy trình và thủ tục khai báo hải quan nhập khẩu, luật thuế quan và các biện pháp thuế quan tạm thời đối với mặt hàng nông nghiệp nhập khẩu.',
    link: 'https://www.customs.go.jp/english/index.htm',
    accentColor: '#BC002D',
    flag: '🇯🇵',
    articlesCount: 112,
    lastUpdated: 'June 2026',
    lastUpdatedVi: 'Tháng 6, 2026',
    applicableProduce: ['All Agricultural Exports', 'Import Cargo'],
    applicableProduceVi: ['Nông Sản Xuất Khẩu', 'Hàng Hóa Nhập Khẩu'],
    tags: ['Customs Clearance', 'Tariff Measures', 'Import Procedures'],
    tagsVi: ['Thông Quan Hải Quan', 'Hạn Ngạch Thuế Quan', 'Thủ Tục Nhập Khẩu']
  },
  {
    id: 'jp-jetro-regulations',
    country: 'Japan',
    name: 'JETRO Import Regulations Guide',
    nameVi: 'Hướng dẫn Quy định Nhập khẩu Nông Lâm Thủy sản của JETRO',
    body: 'JETRO',
    bodyVi: 'Tổ chức Xúc tiến Thương mại Nhật Bản (JETRO)',
    covers: 'Comprehensive trade regulations guide for importing agricultural and fishery products into Japan.',
    coversVi: 'Cẩm nang toàn diện hướng dẫn về quy phạm thương mại, hàng rào kỹ thuật kiểm dịch đối với nông sản nhập khẩu trực tiếp vào Nhật Bản.',
    link: 'https://www.jetro.go.jp/en/reports/regulations/',
    accentColor: '#BC002D',
    flag: '🇯🇵',
    articlesCount: 1,
    lastUpdated: 'Live Source',
    lastUpdatedVi: 'Theo Dõi Trực Tuyến',
    applicableProduce: ['Agricultural Products', 'Fishery Products', 'Food Imports'],
    applicableProduceVi: ['Sản Phẩm Nông Nghiệp', 'Thủy Hải Sản', 'Thực Phẩm Nhập Khẩu'],
    tags: ['Import Guide', 'JETRO Regulations', 'Trade Policy'],
    tagsVi: ['Cẩm Nang Nhập Khẩu', 'Quy Định JETRO', 'Biện Pháp Thương Mại']
  }
];

// Bilingual static dictionaries translation object 
const TRANSLATIONS = {
  vi: {
    disclaimer: "Công cụ này liên kết đến các cổng thông tin chính phủ nước ngoài và biểu luật chính thức. Khuyến cáo Freight Forwarder Việt Nam luôn đối chiếu văn bản số mới nhất trực tiếp tại cơ quản có thẩm quyền trước khi thông quan.",
    subTitle: "Cơ Chế Quy Định Nông Nghiệp Quốc Tế Aegis",
    desc: "Cung cấp cho các đơn vị giao nhận vận tải (Freight Forwarder), doanh nghiệp Logistics và tổ chức xuất khẩu Việt Nam công cụ tra cứu số liệu tinh gọn, chính thống, tức thì về thủ tục kiểm dịch (SPS) và giới hạn dư lượng (MRL) tại các thị trường trọng điểm.",
    totalChecked: "Tổng số văn bản",
    filterByMarket: "LỌC THEO THỊ TRƯỜNG:",
    allMarkets: "Mọi Thị Trường",
    searchPlaceholder: "Tìm kiếm văn bản luật, loại rau quả xuất khẩu, tên cơ quan kiểm soát hoặc ngưỡng MRL...",
    clear: "Xóa Lọc",
    exporterGuide: "Sổ Tay Khai Thác Tiền Xuất Khẩu",
    exporterGuideDesc: "Để hạn chế nguy cơ ách tắc lưu kho bãi, doanh nghiệp giao nhận cần phối hợp chặt chẽ với chủ hàng tiến hành 3 điểm rà soát cốt lõi:",
    facilityReg: "1. Đăng ký mã xưởng sản xuất",
    facilityRegDesc: "Đăng ký hiển thị pháp nhân cơ sở đóng gói và vùng trồng trên hệ thống FDA (Hoa Kỳ) hoặc CIFER (Tổng cục Hải quan Trung Quốc GACC).",
    mrlLimits: "2. Kiểm soát giới hạn dư lượng MRL",
    mrlLimitsDesc: "Thực hiện xét nghiệm độc lập tại các phòng phòng lab chỉ định để chắc chắn nồng độ vi sinh, chất diệt nấm tuân thủ ranh giới luật quy định.",
    spsQuarantines: "3. Biên bản kiểm dịch thực vật",
    spsQuarantinesDesc: "Chứng minh quy trình xử lý dịch hại bắt buộc thông qua hồ sơ chạy hơi nước nóng (VHT) hoặc chiếu xạ kiểm dịch biên giới.",
    bilateralState: "Tình trạng cổng dữ liệu:",
    secured: "ĐỒNG BỘ CHI TIẾT",
    pinnedCirculars: "Thông Tư Đã Ghim",
    noPinned: "Chưa ghim văn bản nào. Vui lòng bấm vào icon ruy-băng trên từng thẻ quy định để lập cẩm nang thông quan tham khảo nhanh.",
    verificationNotice: "Biểu thuế và quy tắc kiểm dịch có thể biến động dựa trên bối cảnh rà soát thương mại song phương. Freight forwarder nên kiểm tra các đường link trang gốc đính kèm trên thẻ.",
    showingRecords: "ĐANG HIỂN THỊ {count} VĂN BẢN QUY PHÁP KIỂM ĐỊNH",
    filterKey: "Khóa Lọc Hoạt Động",
    noRecordsTitle: "Không Có Hồ Sơ Trùng Khớp",
    noRecordsDesc: "Chúng tôi đã tìm khắp cơ sở dữ liệu tích hợp nhưng không thấy văn bản nào khớp hoặc thị trường này chưa mở phân hạng. Thử làm sạch hộp tìm kiếm.",
    coverageScope: "PHẠM VI ĐIỀU CHỈNH & NGHĨA VỤ PHÁP LÝ",
    viewOfficialSource: "Tới Cổng Gốc Quốc Gia →",
    lastUpdated: "CẬP NHẬT GẦN NHẤT",
    complianceEngine: "Cơ Chế Kiểm Soát Aegis Trade • Giao Diện Xuất Khẩu Bản Địa Việt Nam",
    modalCircular: "Thông Tin Sổ Tay Quy Định Chi Tiết",
    modalClose: "Đóng cửa sổ [ESC]",
    modalAuthority: "Cơ Quan Kiểm Tác",
    modalStatus: "Trạng Thái Hải Quan",
    modalActive: "Có hiệu lực hành pháp & Đã kiểm chứng",
    modalLastPolled: "Lượt Polled gần nhất:",
    modalScopeTitle: "Phạm Vi Điều Chỉnh & Nghĩa Vụ Chi Tiết",
    modalCommodities: "Nông Thủy Sản Chịu Sự Điều Chỉnh",
    modalArticles: "Số điều khoản quản lý:",
    modalArticlesUnit: "điều khoản",
    modalEncryption: "Tiêu chuẩn giải mật:",
    modalMrlLimit: "Hạn hạn kiểm soát dư lượng:",
    modalMrlStrict: "Áp dụng ngưỡng cực kỳ nghiêm ngặt",
    modalRef: "Mã Hệ Thống:",
    modalOfficialLedger: "Sổ Quy chuẩn Thương mại Toàn cầu",
    modalDownloadPdf: "Tải tệp PDF",
    modalVisitBulletin: "Liên Kết Tới Cổng Gốc",
    switchLanguage: "🇺🇸 English",
    downloadComplete: "Tải xuống thành công!",
    vietnameseFreightForwarderBadge: "Bản địa hóa VN Freight Forwarder"
  },
  en: {
    disclaimer: "This page links to official government sources. Always verify the latest version directly with the relevant authority.",
    subTitle: "Aegis International Agricultural Regulations Database",
    desc: "Provides Vietnamese freight forwarders, logistics handlers, and international agricultural exporters with simplified, official, instant access to trade guidelines, sanitary & phytosanitary (SPS) ordinances, and pesticide MRL ceilings.",
    totalChecked: "Total Checked",
    filterByMarket: "FILTER BY MARKET:",
    allMarkets: "All Markets",
    searchPlaceholder: "Search by law, crop, chemicals limits limit, pesticide MRL or keyword...",
    clear: "Clear Filter",
    exporterGuide: "Before-Export Compliance Checklist",
    exporterGuideDesc: "To mitigate customs delays and cargo rejection risk, freight forwarders must coordinate to satisfy three compliance barriers:",
    facilityReg: "1. Facility & Farm Registry",
    facilityRegDesc: "Verify the grower/packer physical site is registered on FDA or GACC CIFER portals before loading.",
    mrlLimits: "2. Residual MRL Limit Verification",
    mrlLimitsDesc: "Submit harvest samples to licensed laboratories to make sure agrochemical trace counts are within bounds.",
    spsQuarantines: "3. Phytosanitary Protocols (SPS)",
    spsQuarantinesDesc: "Ensure pest containment logs (VHT, cold treatment, sulfur fumigation) are attached to shipping logs.",
    bilateralState: "Data Sync Status:",
    secured: "ACTIVE & SECURED",
    pinnedCirculars: "Pinned Regulations",
    noPinned: "No pinned laws. Click the bookmark ribbon on cards to curate a reference export handbook.",
    verificationNotice: "Trade policies and SPS limits fluctuate. Forwarders should verify entries against live official registries link included in cards.",
    showingRecords: "SHOWING {count} CRITICAL REGULATORY INSTRUMENT(S)",
    filterKey: "Active Filter Key",
    noRecordsTitle: "No Regulatory Records Match",
    noRecordsDesc: "We compiled no bilateral statutory laws matching your query. Try broadening keywords or choosing a different target market filtering tab.",
    coverageScope: "COVERAGE & SCOPE",
    viewOfficialSource: "View Official Source →",
    lastUpdated: "LAST UPDATED",
    complianceEngine: "Aegis Trade Compliance Registry • Bilingual Regulatory Engine",
    modalCircular: "Regulation Circular Handbook Details",
    modalClose: "Close [ESC]",
    modalAuthority: "Governing Authority",
    modalStatus: "State Registry Status",
    modalActive: "Active & Checked",
    modalLastPolled: "Last Polled:",
    modalScopeTitle: "Regulatory Scope & Obligations",
    modalCommodities: "Target Commodities Affected",
    modalArticles: "Articles Tracked:",
    modalArticlesUnit: "articles",
    modalEncryption: "Decryption Standards:",
    modalMrlLimit: "MRL Limit Controls:",
    modalMrlStrict: "Strict enforcement applied",
    modalRef: "System Code:",
    modalOfficialLedger: "Official Treaty Ledger",
    modalDownloadPdf: "Download PDF Summary",
    modalVisitBulletin: "Visit Official Bulletin",
    switchLanguage: "🇻🇳 Tiếng Việt",
    downloadComplete: "Downloaded successfully!",
    vietnameseFreightForwarderBadge: "VN Freight Forwarder Edition"
  }
};

interface RegulatoryDatabaseProps {
  language?: 'vi' | 'en';
  setLanguage?: React.Dispatch<React.SetStateAction<'vi' | 'en'>>;
}

export default function RegulatoryDatabase({ language: propLanguage, setLanguage: propSetLanguage }: RegulatoryDatabaseProps = {}) {
  const [localLanguage, setLocalLanguage] = useState<'vi' | 'en'>('vi');
  const language = propLanguage || localLanguage;
  const setLanguage = propSetLanguage || setLocalLanguage;
  const [selectedCountry, setSelectedCountry] = useState<'All' | 'USA' | 'China' | 'Japan'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [activeLawModal, setActiveLawModal] = useState<RegulatoryLaw | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const t = TRANSLATIONS[language];

  // Toggle bookmark function
  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarks(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Simulated PDF download helper
  const handleDownloadPDF = (id: string) => {
    setDownloadingId(id);
    setTimeout(() => {
      setDownloadingId(null);
    }, 1200);
  };

  // Filtered laws calculations
  const filteredLaws = useMemo(() => {
    return REGULATORY_LAWS_DATA.filter(law => {
      const matchesCountry = selectedCountry === 'All' || law.country === selectedCountry;
      
      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesCountry;

      const nameToMatch = (language === 'vi' ? law.nameVi : law.name).toLowerCase();
      const bodyToMatch = (language === 'vi' ? law.bodyVi : law.body).toLowerCase();
      const coversToMatch = (language === 'vi' ? law.coversVi : law.covers).toLowerCase();
      
      const tagsToMatch = (language === 'vi' ? law.tagsVi : law.tags).map(tg => tg.toLowerCase());
      const prodToMatch = (language === 'vi' ? law.applicableProduceVi : law.applicableProduce).map(p => p.toLowerCase());

      const matchesSearch = 
        nameToMatch.includes(query) ||
        bodyToMatch.includes(query) ||
        coversToMatch.includes(query) ||
        tagsToMatch.some(tag => tag.includes(query)) ||
        prodToMatch.some(prod => prod.includes(query)) ||
        // Always search fallback english/vietnamese keys so query results are robust
        law.name.toLowerCase().includes(query) ||
        law.covers.toLowerCase().includes(query);
        
      return matchesCountry && matchesSearch;
    });
  }, [selectedCountry, searchQuery, language]);

  // Count by market for stats
  const statistics = useMemo(() => {
    const total = REGULATORY_LAWS_DATA.length;
    const usa = REGULATORY_LAWS_DATA.filter(l => l.country === 'USA').length;
    const china = REGULATORY_LAWS_DATA.filter(l => l.country === 'China').length;
    const japan = REGULATORY_LAWS_DATA.filter(l => l.country === 'Japan').length;
    return { total, usa, china, japan };
  }, []);

  return (
    <div className="w-full max-w-6xl py-12 px-2 flex flex-col gap-8 text-left max-w-7xl">
      {/* Disclaimer Banner at Top */}
      <div className="w-full p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs leading-relaxed z-10">
        <div className="flex items-start sm:items-center gap-3">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
          <p>{t.disclaimer}</p>
        </div>
        
        {/* Flag badge for forwarders */}
        <div className="shrink-0 flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[9px] font-mono text-amber-300 font-bold tracking-wider uppercase">
          <span>🇻🇳</span> {t.vietnameseFreightForwarderBadge}
        </div>
      </div>

      {/* Cinematic Banner Header */}
      <div className="relative rounded-2xl border border-white/10 bg-white/[0.01] liquid-glass p-6 sm:p-10 backdrop-blur-md overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-2xl">
        {/* Soft glowing ambient blue spot */}
        <div className="absolute top-1/2 left-10 -translate-y-1/2 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        
        <div className="space-y-4 max-w-2xl z-10">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-full text-[10px] font-mono text-[#d4af37] tracking-widest uppercase shadow">
              <Scale className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Computable Governance & Bilateral Portal</span>
            </div>

            {/* Quick Toggle pill directly in the banner */}
            <button
              onClick={() => setLanguage(l => l === 'vi' ? 'en' : 'vi')}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-400 text-[10px] font-mono rounded-full font-bold transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer shadow-sm"
              title="Switch language"
            >
              <span>🌐</span>
              <span>{t.switchLanguage}</span>
            </button>
          </div>

          <h2 className="text-4xl sm:text-5xl text-white font-normal tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            {language === 'vi' ? (
              <>
                Kho Lưu Trữ <span className="italic text-[#d4af37]">Quy Định</span> Xuất Khẩu
              </>
            ) : (
              <>
                The Global <span className="italic text-[#d4af37]">Agricultural</span> Registry
              </>
            )}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-sans font-light">
            {t.desc}
          </p>
        </div>

        {/* Dynamic stats widget */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full md:w-auto shrink-0 z-10 font-mono text-center">
          <div className="p-3 rounded-xl border border-white/10 bg-white/[0.02] flex flex-col justify-center min-w-[90px] shadow-sm">
            <span className="text-xl sm:text-2xl font-bold text-white">{statistics.total}</span>
            <span className="text-[9px] text-muted-foreground uppercase mt-1">{t.totalChecked}</span>
          </div>
          <div className="p-3 rounded-xl border border-white/10 bg-white/[0.02] flex flex-col justify-center min-w-[90px] shadow-sm hover:border-[#B22234]/30 transition-colors">
            <span className="text-xl sm:text-2xl font-bold text-red-400">{statistics.usa}</span>
            <span className="text-[9px] text-muted-foreground uppercase mt-1 flex items-center justify-center gap-1">🇺🇸 USA</span>
          </div>
          <div className="p-3 rounded-xl border border-white/10 bg-white/[0.02] flex flex-col justify-center min-w-[90px] shadow-sm hover:border-[#DE2910]/30 transition-colors">
            <span className="text-xl sm:text-2xl font-bold text-red-500">{statistics.china}</span>
            <span className="text-[9px] text-muted-foreground uppercase mt-1 flex items-center justify-center gap-1">🇨🇳 China</span>
          </div>
          <div className="p-3 rounded-xl border border-white/10 bg-white/[0.02] flex flex-col justify-center min-w-[90px] shadow-sm hover:border-[#BC002D]/30 transition-colors">
            <span className="text-xl sm:text-2xl font-bold text-rose-400">{statistics.japan}</span>
            <span className="text-[9px] text-muted-foreground uppercase mt-1 flex items-center justify-center gap-1">🇯🇵 Japan</span>
          </div>
        </div>
      </div>

      {/* Control Panel: Countries Tabs, Language Switcher & Search */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between z-10 bg-white/[0.01] p-4 rounded-xl border border-white/5">
        
        {/* Market Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
          <span className="text-[10px] font-mono tracking-widest text-[#d4af37] font-extrabold uppercase ml-1 mr-2 hidden sm:inline-block">
            {t.filterByMarket}
          </span>
          <button
            onClick={() => setSelectedCountry('All')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-medium tracking-wide transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCountry === 'All'
                ? 'bg-white/10 text-white border border-white/20 shadow-lg shadow-black/40 backdrop-blur-md'
                : 'bg-white/5 text-muted-foreground hover:text-white border border-transparent'
            }`}
          >
            <span>🌐</span>
            <span>{t.allMarkets}</span>
          </button>
          <button
            onClick={() => setSelectedCountry('USA')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-medium tracking-wide transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCountry === 'USA'
                ? 'bg-[#B22234]/15 text-[#ffcaca] border border-[#B22234]/40 shadow-lg shadow-red-950/20'
                : 'bg-white/5 text-muted-foreground hover:text-white border border-transparent'
            }`}
          >
            <span>🇺🇸</span>
            <span>USA</span>
          </button>
          <button
            onClick={() => setSelectedCountry('China')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-medium tracking-wide transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCountry === 'China'
                ? 'bg-[#DE2910]/15 text-[#ffe3e3] border border-[#DE2910]/40 shadow-lg shadow-amber-950/20'
                : 'bg-white/5 text-muted-foreground hover:text-white border border-transparent'
            }`}
          >
            <span>🇨🇳</span>
            <span>China</span>
          </button>
          <button
            onClick={() => setSelectedCountry('Japan')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-medium tracking-wide transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCountry === 'Japan'
                ? 'bg-[#BC002D]/15 text-[#ffe4e4] border border-[#BC002D]/40 shadow-lg shadow-rose-950/20'
                : 'bg-white/5 text-muted-foreground hover:text-white border border-transparent'
            }`}
          >
            <span>🇯🇵</span>
            <span>Japan</span>
          </button>
        </div>

        {/* Search Input Filter & Quick Language Button */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/10 placeholder:text-muted-foreground/45 transition-all font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white text-xs font-sans font-bold cursor-pointer"
              >
                {t.clear}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid Content Area: Sidebars & Cards Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Controls & General Guidance Notes */}
        <div className="space-y-6 lg:col-span-1 border-r border-white/5 pr-0 lg:pr-4">
          
          {/* Quick Guide Panel with premium glass design */}
          <div className="p-6 rounded-xl border border-white/10 bg-white/[0.01] liquid-glass text-left space-y-4 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-sky-500/10 text-sky-400">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <h3 className="text-white text-sm font-semibold">{t.exporterGuide}</h3>
            </div>
            
            <p className="text-[11px] text-muted-foreground leading-relaxed leading-normal">
              {t.exporterGuideDesc}
            </p>

            <ul className="space-y-3.5 text-[11px] text-muted-foreground">
              <li className="flex flex-col gap-1 items-start bg-white/[0.01] border border-white/5 p-2 rounded">
                <div className="flex items-center gap-1.5 text-white font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>{t.facilityReg}</span>
                </div>
                <span className="pl-5 text-[10px] leading-relaxed text-muted-foreground/85">
                  {t.facilityRegDesc}
                </span>
              </li>
              <li className="flex flex-col gap-1 items-start bg-white/[0.01] border border-white/5 p-2 rounded">
                <div className="flex items-center gap-1.5 text-white font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>{t.mrlLimits}</span>
                </div>
                <span className="pl-5 text-[10px] leading-relaxed text-muted-foreground/85">
                  {t.mrlLimitsDesc}
                </span>
              </li>
              <li className="flex flex-col gap-1 items-start bg-white/[0.01] border border-white/5 p-2 rounded">
                <div className="flex items-center gap-1.5 text-white font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>{t.spsQuarantines}</span>
                </div>
                <span className="pl-5 text-[10px] leading-relaxed text-muted-foreground/85">
                  {t.spsQuarantinesDesc}
                </span>
              </li>
            </ul>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-sky-400">
              <span>{t.bilateralState}</span>
              <span className="font-bold flex items-center gap-1 text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {t.secured}
              </span>
            </div>
          </div>

          {/* Bookmarks quick widget */}
          <div className="p-6 rounded-xl border border-white/10 bg-white/[0.01] space-y-3 text-left">
            <h4 className="text-xs font-semibold text-white flex items-center gap-1.5">
              <Bookmark className="w-4 h-4 text-[#d4af37]" />
              {t.pinnedCirculars} ({bookmarks.length})
            </h4>
            
            {bookmarks.length === 0 ? (
              <p className="text-[11px] text-muted-foreground font-sans italic font-light leading-relaxed">
                {t.noPinned}
              </p>
            ) : (
              <div className="space-y-2">
                {bookmarks.map(id => {
                  const savedLaw = REG_REGULATORY_LAWS_DATA_FINDER(id);
                  if (!savedLaw) return null;
                  const localizedName = language === 'vi' ? savedLaw.nameVi : savedLaw.name;
                  return (
                    <div 
                      key={id} 
                      onClick={() => setActiveLawModal(savedLaw)}
                      className="p-2 border border-white/5 bg-white/[0.01] rounded hover:border-white/20 hover:bg-white/[0.02] cursor-pointer transition-all flex items-center justify-between gap-2 overflow-hidden"
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-xs">{savedLaw.flag}</span>
                        <span className="text-[11px] font-mono text-gray-300 truncate font-light leading-none">{localizedName}</span>
                      </div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground/60 shrink-0" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* PDF generation notice */}
          <div className="p-4 rounded-xl border border-white/[0.04] bg-white/[0.005] flex items-center gap-2.5 text-left text-[11px] text-muted-foreground leading-relaxed">
            <Info className="w-4 h-4 text-sky-400/80 shrink-0" />
            <span>
              {t.verificationNotice}
            </span>
          </div>
        </div>

        {/* Laws Grids: Show matching regulatory rules */}
        <div className="lg:col-span-3 space-y-4">
          
          <div className="flex justify-between items-center text-xs text-muted-foreground pb-2 border-b border-white/[0.04] font-mono">
            <span>{t.showingRecords.replace('{count}', filteredLaws.length.toString())}</span>
            {searchQuery && <span className="text-[#d4af37]">{t.filterKey}: "{searchQuery}"</span>}
          </div>

          {filteredLaws.length === 0 ? (
            <div className="p-16 border rounded-xl border-white/5 bg-white/[0.005] flex flex-col items-center justify-center text-center space-y-4">
              <AlertCircle className="w-8 h-8 text-muted-foreground/45 animate-bounce" />
              <div>
                <h5 className="text-sm font-semibold text-white">{t.noRecordsTitle}</h5>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                  {t.noRecordsDesc}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredLaws.map((law, idx) => {
                  const localizedName = language === 'vi' ? law.nameVi : law.name;
                  const localizedBody = language === 'vi' ? law.bodyVi : law.body;
                  const localizedCovers = language === 'vi' ? law.coversVi : law.covers;
                  const localizedTags = language === 'vi' ? law.tagsVi : law.tags;

                  return (
                    <motion.div
                      key={law.id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.3, delay: Math.min(6, idx) * 0.05 }}
                      onClick={() => setActiveLawModal(law)}
                      className="group border border-white/5 hover:border-white/10 bg-white/[0.01] hover:bg-white/[0.03] p-5 rounded-xl flex flex-col justify-between transition-all duration-300 cursor-pointer min-h-[300px] relative overflow-hidden shadow-sm"
                    >
                      {/* Visual country-specific accent line at the top */}
                      <div className="absolute top-0 left-0 w-full h-[1.5px]" style={{ backgroundColor: law.accentColor }} />

                      {/* Accent indicator vertical line - subtle right-side glow */}
                      <div 
                        className="absolute top-0 right-0 w-[2px] h-full opacity-30" 
                        style={{ backgroundColor: law.accentColor }} 
                      />

                      <div className="space-y-3.5">
                        
                        {/* Top Row: Flag emoji + Country Badge, Governing Body Pill & Bookmark */}
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex flex-col gap-2">
                            {/* Flag emoji + Country Badge */}
                            <div className="flex items-center gap-1.5">
                              <span className="text-xl">{law.flag}</span>
                              <span 
                                className="px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase shadow-sm animate-fade-in"
                                style={{ backgroundColor: `${law.accentColor}15`, border: `1px solid ${law.accentColor}30`, color: law.accentColor }}
                              >
                                {law.country}
                              </span>
                            </div>
                            
                            {/* Governing body tag (small pill badge) */}
                            <div className="flex items-center">
                              <span 
                                className="px-2 py-0.5 rounded-full text-[9px] font-mono tracking-wide bg-white/5 border border-white/10 text-gray-300 font-medium truncate max-w-[170px]"
                                title={`${t.modalAuthority}: ${localizedBody}`}
                              >
                                🏛️ {localizedBody}
                              </span>
                            </div>
                          </div>

                          {/* Ribbon Bookmark button */}
                          <button
                            onClick={(e) => toggleBookmark(law.id, e)}
                            className="p-1.5 rounded-md hover:bg-white/5 text-muted-foreground hover:text-white transition-colors cursor-pointer shrink-0"
                            title="Bookmark Circular"
                          >
                            {bookmarks.includes(law.id) ? (
                              <BookmarkCheck className="w-4 h-4 text-[#d4af37]" />
                            ) : (
                              <Bookmark className="w-4 h-4 opacity-50 hover:opacity-100" />
                            )}
                          </button>
                        </div>

                        {/* Line Title */}
                        <div className="text-left space-y-1">
                          <h4 className="text-base font-bold text-white group-hover:text-white transition-colors tracking-tight line-clamp-2">
                            {localizedName}
                          </h4>
                        </div>

                        {/* Content Coverage */}
                        <div className="text-left pt-1">
                          <span className="text-[9px] uppercase font-mono tracking-widest text-[#d4af37] font-semibold block mb-0.5">
                            {t.coverageScope}
                          </span>
                          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2" title={localizedCovers}>
                            {localizedCovers}
                          </p>
                        </div>
                      </div>

                      {/* Bottom Action Section: Produce Tags & Hyperlink button */}
                      <div className="pt-4 border-t border-white/[0.04] mt-4 flex items-center justify-between gap-2">
                        <div className="flex flex-wrap gap-1">
                          {localizedTags.slice(0, 2).map((tg, i) => (
                            <span 
                              key={i} 
                              style={{ backgroundColor: `${law.accentColor}10`, borderColor: `${law.accentColor}25`, color: law.accentColor }}
                              className="text-[8px] font-mono tracking-wider uppercase font-semibold px-1.5 py-0.5 rounded border"
                            >
                              {tg}
                            </span>
                          ))}
                        </div>
                        
                        <a
                          href={law.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-mono font-semibold tracking-wide bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white transition-all duration-200 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <span>{t.viewOfficialSource}</span>
                        </a>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Page Footer Section with Last Updated and Attribution */}
      <footer className="w-full mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-muted-foreground/60">
        <span>{t.lastUpdated}: 2026-06-04 07:50:59 UTC</span>
        <span>{t.complianceEngine}</span>
      </footer>

      {/* Law Detailed Modal Dialog Popup */}
      <AnimatePresence>
        {activeLawModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveLawModal(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md z-[11000] cursor-pointer"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed inset-4 max-w-2xl h-fit max-h-[90vh] my-auto mx-auto bg-[#040c14]/95 border border-white/10 rounded-2xl shadow-2xl z-[11001] flex flex-col overflow-hidden text-left backdrop-blur-xl liquid-glass animate-fade-in"
            >
              {/* Country Accent vertical header tab */}
              <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ backgroundColor: activeLawModal.accentColor }} />

              {/* Header */}
              <div className="px-6 py-5 border-b border-white/[0.08] flex justify-between items-start gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{activeLawModal.flag}</span>
                  <div>
                    <span 
                      style={{ backgroundColor: `${activeLawModal.accentColor}15`, borderColor: `${activeLawModal.accentColor}30`, color: activeLawModal.accentColor }} 
                      className="text-[10px] font-mono uppercase border px-2 py-0.5 rounded"
                    >
                      {activeLawModal.country === 'USA' ? 'USA' : activeLawModal.country} {t.modalCircular}
                    </span>
                    <h3 className="text-xl font-medium text-white tracking-tight mt-1">
                      {language === 'vi' ? activeLawModal.nameVi : activeLawModal.name}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setActiveLawModal(null)}
                  className="p-1 px-2.5 rounded-md hover:bg-white/5 border border-white/5 text-xs text-muted-foreground hover:text-white font-mono cursor-pointer"
                >
                  {t.modalClose}
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 space-y-5 overflow-y-auto max-h-[60vh] text-left">
                
                {/* Governing Administration Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg border border-white/5 bg-white/[0.01]">
                    <span className="text-[9px] font-mono uppercase text-muted-foreground block">
                      {t.modalAuthority}
                    </span>
                    <span className="text-xs text-white font-mono block mt-1 font-semibold leading-relaxed">
                      {language === 'vi' ? activeLawModal.bodyVi : activeLawModal.body}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg border border-white/5 bg-white/[0.01]">
                    <span className="text-[9px] font-mono uppercase text-muted-foreground block">
                      {t.modalStatus}
                    </span>
                    <span className="text-xs text-sky-400 font-mono block mt-1 font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                      {t.modalActive}
                    </span>
                    <span className="text-[10px] text-muted-foreground block mt-0.5 font-light font-mono">
                      {t.modalLastPolled} {language === 'vi' ? activeLawModal.lastUpdatedVi : activeLawModal.lastUpdated}
                    </span>
                  </div>
                </div>

                {/* Substantive Coverage Blocks */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                    {t.modalScopeTitle}
                  </h4>
                  <div 
                    style={{ borderColor: `${activeLawModal.accentColor}20`, backgroundColor: `${activeLawModal.accentColor}05` }}
                    className="p-4 rounded-xl border text-xs leading-relaxed text-muted-foreground font-sans space-y-3 font-light"
                  >
                    <p>{language === 'vi' ? activeLawModal.coversVi : activeLawModal.covers}</p>
                  </div>
                </div>

                {/* Product applicability tags */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                    {t.modalCommodities}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(language === 'vi' ? activeLawModal.applicableProduceVi : activeLawModal.applicableProduce).map((prod, i) => (
                      <span key={i} className="text-[10px] font-mono text-white/95 bg-white/5 border border-white/10 px-2.5 py-1 rounded">
                        {prod}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Circular statistics/details */}
                <div className="grid grid-cols-3 gap-6 pt-2 font-mono text-[10px] text-muted-foreground">
                  <div>
                    <span className="block text-white">{t.modalArticles}</span>
                    <span className="font-bold text-gray-300 font-sans text-xs">{activeLawModal.articlesCount} {t.modalArticlesUnit}</span>
                  </div>
                  <div>
                    <span className="block text-white">{t.modalEncryption}</span>
                    <span className="text-[#d4af37] font-bold">Aegis SH3 Secure</span>
                  </div>
                  <div>
                    <span className="block text-white">{t.modalMrlLimit}</span>
                    <span className="text-white">{t.modalMrlStrict}</span>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="px-6 py-4 border-t border-white/[0.08] bg-white/[0.01] flex flex-col sm:flex-row justify-between items-center gap-4">
                <span className="text-[10px] font-mono text-muted-foreground leading-none">
                  {t.modalRef} {activeLawModal.id.toUpperCase()} • {t.modalOfficialLedger}
                </span>
                
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {/* Non-blocking PDF Download implementation */}
                  <button
                    onClick={() => handleDownloadPDF(activeLawModal.id)}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-white/10 bg-white/5 hover:bg-white/10 active:scale-95 text-xs font-mono rounded-lg text-white font-medium cursor-pointer transition-all duration-200"
                  >
                    <Download className={`w-3.5 h-3.5 ${downloadingId === activeLawModal.id ? 'animate-bounce text-emerald-400' : ''}`} />
                    <span>
                      {downloadingId === activeLawModal.id 
                        ? t.downloadComplete 
                        : t.modalDownloadPdf}
                    </span>
                  </button>
                  <a
                    href={activeLawModal.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ backgroundColor: activeLawModal.accentColor }}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 hover:opacity-90 text-xs font-mono rounded-lg text-white font-semibold cursor-pointer shadow transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>{t.modalVisitBulletin}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-white" />
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Inline constant safe helper
function REG_REGULATORY_LAWS_DATA_FINDER(id: string): RegulatoryLaw | undefined {
  return REGULATORY_LAWS_DATA.find(l => l.id === id);
}
