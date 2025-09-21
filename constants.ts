import { FoodItem, Order, OrderStatus, Voucher, Campaign } from './types';

// URL for the FTU YUM application logo.
export const FTU_LOGO_URL = 'https://i.ibb.co/Kx4bFBvw/s.png';

export const sampleFoodItems: FoodItem[] = [
  {
    id: 6,
    name: 'Soda Đỏ FTU',
    description: 'Một chút "cháy" cho ngày deadline. Soda dâu tây kết hợp với siro bạc hà và chanh tươi, mang lại cảm giác bùng nổ.',
    price: 22000,
    imageUrls: ['https://i.ibb.co/PvkB2Cgj/unnamed-2.png'],
    category: 'Thực đơn Cảm xúc',
    popularity: 198,
    rating: 4.8,
    reviews: [
         { id: 4, author: 'Quang Huy', rating: 5, comment: 'Uống vào tỉnh ngủ hẳn, màu đẹp, vị cũng ngon.', date: '2024-07-18', avatarUrl: 'https://i.pravatar.cc/150?u=quanghuy' },
    ]
  },
  {
    id: 2,
    name: 'Kem Bia Đá',
    description: 'Độc quyền tại FTU! Vị kem mát lạnh kết hợp với hương bia thơm nhẹ, giải nhiệt tức thì, sảng khoái tinh thần.',
    price: 20000,
    imageUrls: ['https://i.ibb.co/GvQWpnv8/unnamed.png'],
    category: 'FTU Signature',
    popularity: 215,
    rating: 4.8,
    reviews: [
         { id: 3, author: 'Hà Trang', rating: 5, comment: 'Kem ngon lắm ạ, vị lạ mà cuốn cực!', date: '2024-07-22', avatarUrl: 'https://i.pravatar.cc/150?u=hatrang' },
    ]
  },
  {
    id: 1,
    name: 'Bún Chả Hà Nội',
    description: 'Bún chả que tre chuẩn vị Hà Thành, thịt nướng thơm lừng trên than hoa, ăn kèm nước mắm chua ngọt và rau sống tươi ngon.',
    price: 35000,
    imageUrls: ['https://cdn.zsoft.solutions/poseidon-web/app/media/uploaded-files/090724-bun-cha-ha-noi-buffet-poseidon-1.jpeg'],
    category: 'Món Chính',
    popularity: 132,
    rating: 4.9,
    reviews: [
        { id: 1, author: 'Ngọc Anh', rating: 5, comment: 'Bún chả siêu ngon, thịt nướng mềm và thơm. Nước chấm vừa miệng!', date: '2024-07-21', avatarUrl: 'https://i.pravatar.cc/150?u=ngocanh' },
        { id: 2, author: 'Đức Thắng', rating: 5, comment: 'Quán ruột của mình. Chưa bao giờ thất vọng.', date: '2024-07-20', avatarUrl: 'https://i.pravatar.cc/150?u=ducthang' },
    ],
    options: [
        {
            id: 'extra',
            title: 'Thêm',
            type: 'multiple',
            choices: [
                { name: 'Thêm bún', price: 5000 },
                { name: 'Thêm chả', price: 10000 },
                { name: 'Nem rán', price: 8000 },
            ]
        }
    ]
  },
  {
    id: 3,
    name: 'Trà Sữa Trân Châu Đường Đen',
    description: 'Hồng trà sữa thơm béo, kết hợp trân châu đường đen dai mềm, ngọt ngào. Một lựa chọn không thể bỏ qua cho các tín đồ trà sữa.',
    price: 25000,
    imageUrls: ['https://xingfuvietnam.vn/wp-content/uploads/2023/02/xingfu-tra-sua-tran-chau-duong-den-2-FILEminimizer.jpg'],
    category: 'Đồ uống',
    popularity: 180,
    rating: 4.7,
    options: [
        {
            id: 'sugar',
            title: 'Mức đường',
            type: 'single',
            required: true,
            choices: [
                { name: '100% đường', price: 0 },
                { name: '70% đường', price: 0 },
                { name: '50% đường', price: 0 },
                { name: '30% đường', price: 0 },
                { name: 'Không đường', price: 0 },
            ]
        },
        {
            id: 'ice',
            title: 'Mức đá',
            type: 'single',
            required: true,
            choices: [
                { name: '100% đá', price: 0 },
                { name: '70% đá', price: 0 },
                { name: '50% đá', price: 0 },
                { name: 'Không đá', price: 0 },
            ]
        },
        {
            id: 'toppings',
            title: 'Thêm topping',
            type: 'multiple',
            choices: [
                { name: 'Trân châu trắng', price: 5000 },
                { name: 'Pudding trứng', price: 7000 },
                { name: 'Thạch phô mai', price: 7000 },
            ]
        }
    ]
  },
  {
    id: 4,
    name: 'Cơm Gà Xối Mỡ',
    description: 'Đùi gà góc tư chiên giòn rụm, da vàng óng, thịt bên trong mềm ngọt. Ăn cùng cơm chiên và dưa góp.',
    price: 40000,
    imageUrls: ['https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/2023_10_26_638339270908299051_com-ga-xoi-mo-03.jpg'],
    category: 'Món Chính',
    popularity: 95,
    rating: 4.6,
  },
  {
    id: 5,
    name: 'Nước ép Cam Tươi',
    description: '100% cam tươi nguyên chất, không đường, không chất bảo quản. Cung cấp vitamin C, tăng cường đề kháng.',
    price: 20000,
    imageUrls: ['https://cdn2.fptshop.com.vn/unsafe/Nuoc_ep_cam_0ae1447a8f.jpg'],
    category: 'Đồ uống',
    popularity: 150,
    rating: 4.9,
  },
  {
    id: 7,
    name: 'Bánh Mì Chảo',
    description: 'Bữa sáng no nê với pate, trứng ốp la, xúc xích, thịt quay và xíu mại. Ăn kèm bánh mì nóng giòn.',
    price: 38000,
    imageUrls: ['https://cdn.tgdd.vn/Files/2022/01/08/1409748/bat-mi-x-cach-lam-banh-mi-chao-tai-nha-thom-ngon-cho-bua-sang-202201080732348741.jpg'],
    category: 'Món Chính',
    popularity: 88,
    rating: 4.5,
  },
  {
    id: 8,
    name: 'Khoai Tây Chiên',
    description: 'Khoai tây giòn rụm, vàng ươm, chấm cùng tương cà hoặc tương ớt. Món ăn vặt không thể thiếu.',
    price: 15000,
    imageUrls: ['https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/khoai_tay_chien_bao_nhieu_calo_350315fde7.jpg'],
    category: 'Đồ ăn vặt',
    popularity: 250,
    rating: 4.6,
  },
  {
    id: 9,
    name: 'Deadline Coffee',
    description: 'Cà phê đậm đặc, giúp bạn tỉnh táo chạy deadline xuyên đêm. "Gấp đôi espresso, không đường, không tình yêu."',
    price: 25000,
    imageUrls: ['https://deadline.coffee/cdn/shop/files/deadlone-coffee-taking-care-of-business.jpg?v=1742231762'],
    category: 'Thực đơn Cảm xúc',
    popularity: 175,
    rating: 4.8,
  },
  {
    id: 10,
    name: 'Bánh Quy D201',
    description: 'Hộp bánh quy bơ giòn tan, in logo FTU. Món quà vặt lý tưởng cho những buổi học nhóm tại phòng D201 huyền thoại.',
    price: 30000,
    imageUrls: ['https://i.ibb.co/FLfpYXkr/unnamed-4.png'],
    category: 'FTU Signature',
    popularity: 110,
    rating: 4.9,
  },
  {
    id: 11,
    name: 'Soup Hồi Sinh',
    description: 'Chén súp gà nóng hổi, bổ dưỡng, giúp bạn phục hồi năng lượng sau những giờ học căng thẳng hoặc những ngày ốm vặt.',
    price: 20000,
    imageUrls: ['https://product.hstatic.net/200000408931/product/sup-vi-ca-map_266fa4ce5e044ffc8e9dfa425003502e.jpg'],
    category: 'Thực đơn Cảm xúc',
    popularity: 85,
    rating: 4.7,
  },
  {
    id: 12,
    name: 'Cơm Tấm Sườn Bì Chả',
    description: 'Dĩa cơm tấm đầy đủ sườn nướng, bì, chả trứng hấp, ăn kèm đồ chua và nước mắm chua ngọt. Một bữa trưa "chắc bụng".',
    price: 45000,
    imageUrls: ['https://media-cdn-v2.laodong.vn/storage/newsportal/2023/11/29/1273358/Com-Tam-2-01.jpeg'],
    category: 'Món Chính',
    popularity: 160,
    rating: 4.8
  },
  {
    id: 13,
    name: 'Bánh Mì Thập Cẩm',
    description: 'Bánh mì giòn rụm với pate, thịt nguội, chả lụa, dưa leo, đồ chua và rau mùi. Lựa chọn nhanh gọn cho bữa sáng hoặc bữa xế.',
    price: 20000,
    imageUrls: ['https://cdn2.fptshop.com.vn/unsafe/800x0/banh_mi_thap_cam_5_0e3359c2bf.jpg'],
    category: 'Đồ ăn vặt',
    popularity: 280,
    rating: 4.7
  },
  {
    id: 14,
    name: 'Xôi Xéo',
    description: 'Xôi nếp dẻo thơm, màu vàng óng từ nghệ, phủ lớp đậu xanh xay mịn, hành phi giòn tan và mỡ hành béo ngậy.',
    price: 15000,
    imageUrls: ['https://statics.vinpearl.com/xoi-xeo-ha-noi-1_1692290241.jpg'],
    category: 'Món Chính',
    popularity: 190,
    rating: 4.9
  },
  {
    id: 15,
    name: 'Mỳ Tôm Trứng Chần',
    description: 'Món ăn "quốc dân" cứu đói mọi lúc. Mỳ tôm dai ngon, thêm trứng chần lòng đào và hành lá. Đơn giản mà ấm lòng.',
    price: 18000,
    imageUrls: ['https://cdn.tgdd.vn/Files/2019/10/19/1210099/cach-nau-mi-trung-ca-chua-cuc-ngon-an-hoai-chang-ngan-202208312147171761.jpg'],
    category: 'Đồ ăn vặt',
    popularity: 220,
    rating: 4.5
  },
  {
    id: 16,
    name: 'Bánh Mì Gà Nướng',
    description: 'Thịt gà nướng sả thơm lừng, đậm vị, kẹp trong ổ bánh mì giòn tan cùng dưa leo, đồ chua và sốt đặc biệt.',
    price: 25000,
    imageUrls: ['https://static.vinwonders.com/production/banh-mi-ga-da-nang-6.jpg'],
    category: 'Đồ ăn vặt',
    popularity: 155,
    rating: 4.6
  },
  {
    id: 17,
    name: 'Xôi Lạp Xưởng',
    description: 'Xôi trắng dẻo thơm ăn cùng lạp xưởng chiên béo ngậy, trứng cút, chà bông và hành phi. Một lựa chọn bữa sáng đầy năng lượng.',
    price: 20000,
    imageUrls: ['https://cdn.tgdd.vn/Files/2021/09/06/1380707/cach-lam-xoi-lap-xuong-ngon-mem-sieu-nhanh-bang-lo-vi-song-202109062230004960.jpg'],
    category: 'Món Chính',
    popularity: 140,
    rating: 4.7
  },
  {
    id: 18,
    name: 'Sữa Chua Topping Tự Chọn',
    description: 'Sữa chua dẻo mịn, kết hợp cùng 3 loại topping đa dạng tự chọn: thạch, trân châu, các loại đậu... Món tráng miệng thanh mát, ngon khó cưỡng.',
    price: 10000,
    imageUrls: ['https://static.hotdeal.vn/images/1543/1542692/60x60/350441-toan-he-thong-rainbow-yogurt-thuong-thuc-nhieu-vi-yogurt-topping-tu-chon-khong-gioi-han-voucher.jpg'],
    category: 'Đồ ăn vặt',
    popularity: 290,
    rating: 4.9
  },
  {
    id: 19,
    name: 'Chè Bơ Cốt Dừa',
    description: 'Chè bơ béo ngậy từ bơ sáp tươi, hòa quyện với nước cốt dừa thơm lừng và trân châu dai giòn. Món chè giải nhiệt được yêu thích nhất.',
    price: 25000,
    imageUrls: ['https://cdn.tgdd.vn/2021/07/CookProductThumb/CheBoVienNuocCotDua-CachLamCheBoNuocCotDuaDonGianLaMiengCookyTV0-8screenshot-620x620.jpg'],
    category: 'Đồ ăn vặt',
    popularity: 185,
    rating: 4.8
  },
  {
    id: 20,
    name: 'Xiên Que Mix',
    description: 'Combo xiên que chiên giòn gồm xúc xích, lạp xưởng, cá viên, bò viên... Chấm cùng tương ớt "thần thánh", ăn là ghiền.',
    price: 25000,
    imageUrls: ['https://giadinh.mediacdn.vn/zoom/700_438/FYwJ7viWNMAlcII9V7lP1vv6LIIMi/Image/2014/03/xien-nuong-83e21.jpg'],
    category: 'Đồ ăn vặt',
    popularity: 350,
    rating: 4.7
  },
  {
    id: 21,
    name: 'Club Smoothie',
    description: 'Sinh tố ngọt mát, dễ chịu dành cho những buổi chiều chạy sự kiện CLB. Bổ sung vitamin, tiếp thêm năng lượng.',
    price: 25000,
    imageUrls: ['https://mysobol.com/wp-content/uploads/2023/07/IMG-8779.jpg'],
    category: 'Thực đơn Cảm xúc',
    popularity: 130,
    rating: 4.6
  }
];

export const sampleVouchers: Voucher[] = [
    { id: 'vc1', code: 'FREESHIPFTU', description: 'Miễn phí vận chuyển cho đơn hàng', type: 'freeship', value: 15000, minOrder: 30000 },
    { id: 'vc2', code: 'GIAM10', description: 'Giảm 10% tổng hóa đơn', type: 'percentage', value: 10, minOrder: 50000 },
    { id: 'vc3', code: 'KEMBIADA', description: 'Giảm 10.000đ cho Kem Bia Đá', type: 'fixed', value: 10000, applicableItemId: 2 }
];

export const sampleCampaigns: Campaign[] = [
    {
        id: 'campaign1',
        imgUrl: "https://namphuongtinhquan.vn/upload/sanpham/z3051583281085_f322faea4a44e2cd2a5952117422a4f6-0638.jpg",
        title: "Tết Đến Rồi - Bốc Lì Xì Thôi!",
        description: "Mừng xuân Giáp Thìn, FTU YUM lì xì may mắn cho mọi nhà!",
        details: "Với mỗi hóa đơn trên 30,000đ, bạn sẽ nhận được một lượt bốc thăm bao lì xì với nhiều phần quà hấp dẫn như voucher giảm giá, topping miễn phí, hoặc tiền mặt."
    },
    {
        id: 'campaign2',
        imgUrl: "https://i.ibb.co/nsSfsy1b/dcc3b5b8-3f47-4e95-94dc-dbe17c6e523b.jpg",
        title: "Tích Điểm Signature, Rinh Quà FTU",
        description: "Trở thành khách hàng thân thiết và nhận vô vàn đặc quyền từ FTU YUM.",
        details: "Mua combo, check-in, review món ăn để tích điểm. Dùng điểm đổi lấy voucher giảm giá, quà tặng độc quyền của FTU, và nhiều phần thưởng giá trị khác."
    },
    {
        id: 'campaign3',
        imgUrl: "https://i.ibb.co/9jNLpFm/unnamed-3.png",
        title: "Thứ 4 Vui Vẻ - Đồng Giá Bún Chả",
        description: "Giảm stress giữa tuần với món bún chả Hà Nội trứ danh.",
        details: "Vào mỗi thứ 4 hàng tuần, tất cả các suất bún chả sẽ được đồng giá chỉ 25,000đ. Nhanh chân lên kẻo hết!"
    },
    {
        id: 'campaign4',
        imgUrl: "https://i.ibb.co/Q3KXwxd2/unnamed-1.png",
        title: "Set 'Qua Môn' Mùa Thi",
        description: "Combo đồ ăn nhẹ và nước tăng lực giúp bạn tỉnh táo cày deadline và ôn thi hiệu quả.",
        details: "Set 'Qua Môn' bao gồm 1 phần xiên que mix và 1 chai nước tăng lực. Tiếp sức cho mùa thi, xua tan mệt mỏi, đạt điểm A phấp phới!"
    },
    {
        id: 'campaign5',
        imgUrl: "https://scontent.fhan5-11.fna.fbcdn.net/v/t39.30808-6/540688543_1192236266277664_4656731275203593679_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=86c6b0&_nc_ohc=IKxcETt0MU4Q7kNvwH_W6qE&_nc_oc=AdnXJrSHU-MemOh5v4IxTI5SQISnKwS722tYGCFAtOypp51uTt7rzVjgkKoPWFz4rNXQVmAUAtR89r6nxS2DkERr&_nc_zt=23&_nc_ht=scontent.fhan5-11.fna&_nc_gid=9dhIwHeEHjdSMptqdHIqVg&oh=00_AfYQp26Sxr3wzt8J-GFBCGU6iGfdTpUCL5Z5YsM32PeaWg&oe=68D48EB7",
        title: "Chào K64 - Set Tân Sinh Viên",
        description: "Ưu đãi đặc biệt chào mừng tân sinh viên! Mua đồ ăn, nhận quà FTU độc quyền.",
        details: "Khi mua bất kỳ món ăn nào trong danh mục 'FTU Signature', các bạn tân sinh viên sẽ được tặng ngay một bộ sticker FTU siêu cute hoặc một huy hiệu độc quyền. Đừng bỏ lỡ nhé!"
    }
];


export const samplePastOrders: Order[] = [
    {
        id: 'FTU1690123456',
        items: [
            { ...sampleFoodItems.find(i => i.id === 1)!, cartItemId: '1-1', quantity: 1, selectedOptions: [{ optionTitle: 'Thêm', choiceName: 'Nem rán', choicePrice: 8000 }] },
            { ...sampleFoodItems.find(i => i.id === 3)!, cartItemId: '3-1', quantity: 1, selectedOptions: [
                { optionTitle: 'Mức đường', choiceName: '70% đường', choicePrice: 0 },
                { optionTitle: 'Mức đá', choiceName: '100% đá', choicePrice: 0 },
            ]}
        ],
        total: 68000,
        finalTotal: 68000,
        status: OrderStatus.Completed,
        paymentMethod: 'Tiền mặt',
        timestamp: '2024-07-20T10:30:00Z'
    },
    {
        id: 'FTU1689876543',
        items: [
             { ...sampleFoodItems.find(i => i.id === 6)!, cartItemId: '6-1', quantity: 2, selectedOptions: [] }
        ],
        total: 44000,
        finalTotal: 44000,
        status: OrderStatus.Cancelled,
        paymentMethod: 'Mastercard',
        timestamp: '2024-07-18T12:00:00Z'
    },
     {
        id: 'FTU1689123987',
        items: [
            { ...sampleFoodItems.find(i => i.id === 2)!, cartItemId: '2-1', quantity: 1, selectedOptions: [] },
            { ...sampleFoodItems.find(i => i.id === 8)!, cartItemId: '8-1', quantity: 1, selectedOptions: [] },
            { ...sampleFoodItems.find(i => i.id === 9)!, cartItemId: '9-1', quantity: 1, selectedOptions: [] }
        ],
        total: 60000,
        finalTotal: 60000,
        status: OrderStatus.Completed,
        paymentMethod: 'Visa',
        timestamp: '2024-07-15T08:45:00Z'
    }
];