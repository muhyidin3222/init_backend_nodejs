var fonts = {
    Courier: {
        normal: 'Courier',
        bold: 'Courier-Bold',
        italics: 'Courier-Oblique',
        bolditalics: 'Courier-BoldOblique'
    },
    Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique'
    },
    // Cambria: {
    //     blod: "Cambria-Bold",
    //     normal: "Cambria"
    // },
    Times: {
        normal: 'Times-Roman',
        bold: 'Times-Bold',
        italics: 'Times-Italic',
        bolditalics: 'Times-BoldItalic'
    },
    Symbol: {
        normal: 'Symbol'
    },
    ZapfDingbats: {
        normal: 'ZapfDingbats'
    }
};

var PdfPrinter = require('pdfmake');
var printer = new PdfPrinter(fonts);
var fs = require('fs');

exports.createPdf = async (param) => {
    const { docDefinition, options, filePath } = param
    try {
        const pdfDoc = await printer.createPdfKitDocument(docDefinition, options)
        var writeStream = await fs.createWriteStream(filePath)
        await pdfDoc.pipe((fs.createWriteStream(writeStream.path)))
        await pdfDoc.end();
    } catch (err) {
        console.log("createPdf", err)
    }
}

exports.docDefinitionCorporate = (dataCorporate) => {
    const {
        email,
        username,
        mobile_number,
        company_form,
        company_name,
        company_name_alternatif1,
        company_name_alternatif2,
        domicile,
        office_type,
        nominal_capital,
        number_employees,
        shareholders,
        initial_capital,
        address,
        shares,
        user,
        persero_pasif,
        persero_aktif,
        dataKbli
    } = dataCorporate
    const userData = user || {}
    console.log(dataKbli)
    let docDefinition = {
        pageSize: {
            width: 595.28,
            height: 780
        },
        content: [
            { text: `CHECKLIST DOKUMEN - PENDIRIAN ${office_type || ""}.`, style: ['h1Title'] },
            {
                table: {
                    headerRows: 1,
                    widths: [25, "20%", "35%", "35%"],
                    body: [
                        [
                            { text: 'NO', style: ["headerTable"] },
                            { text: 'DOKUMEN', style: ["headerTable"] },
                            [
                                { text: 'KETERSEDIAAN', style: ["headerTable"] },
                                {
                                    columns: [
                                        {
                                            style: ["table", "headerTable"],
                                            width: "50%",
                                            text: 'ADA'
                                        },
                                        {
                                            style: ["table", "headerTable"],
                                            width: "50%",
                                            text: 'TIDAK'
                                        }
                                    ]
                                }
                            ],
                            { text: 'KETERANGAN', style: ["headerTable"] },
                        ],
                        [
                            { text: '1.', style: ["textBody", "bgColor"] },
                            { text: 'Nama Badan Usaha (Minimal 3 Kata)', style: ["textBody", "bgColor"] },
                            [
                                { text: "1." + company_name || "", style: ["textBody"] },
                                { text: company_name_alternatif1 ? "2." + company_name_alternatif1 : "", style: ["textBody"] },
                                { text: company_name_alternatif2 ? "3." + company_name_alternatif2 : "", style: ["textBody"] }
                            ],
                            { text: 'Mohon agar dibuatkan 3 (tiga) alternatif kandidat nama dengan minimal 3 kata yang tidak mengandung bahasa asing', style: ["textBody"] },
                        ],
                        [
                            { text: '2.', style: ['textBody', 'bgColor'] },
                            { text: 'Pendiri', style: ['textBody', 'bgColor'] },
                            { text: username || "", style: ['textBody'] },
                            { text: `Minimal 2 (dua) orang ataupihak, hanya dapat WNI yangmenjadi Pendiri ${office_type || ""}`, style: ['textBody'] },
                        ],
                        [
                            { text: '3.', style: ['textBody', 'bgColor'] },
                            { text: 'Email dan No Telp Para Pendiri', style: ['textBody', 'bgColor'] },
                            { text: userData.email || "" + " dan " + userData.mobile_number || "", style: ['textBody'] },
                            { text: '', style: ['textBody'] },
                        ],
                        [
                            { text: '4.', style: ['textBody', 'bgColor'] },
                            { text: 'Alamat Kedudukan Perseroan', style: ['textBody', 'bgColor'] },
                            { text: domicile || "", style: ['textBody'] },
                            { text: 'Alamat yang digunakan untuk izin domisili.', style: ['textBody'] },
                        ],
                        [
                            { text: '5.', style: ['textBody', 'bgColor'] },
                            { text: 'Alamat Lengkap', style: ['textBody', 'bgColor'] },
                            { text: address || "", style: ['textBody'] },
                            { text: 'Alamat lengkap izin domisili', style: ['textBody'] },
                        ],
                        [
                            { text: '6.', style: ['textBody', 'bgColor'] },
                            { text: 'No. Tlpn Perseroan', style: ['textBody', 'bgColor'] },
                            { text: mobile_number || "", style: ['textBody'] },
                            { text: 'Nomor telepon yang digunakan untuk Perseroan', style: ['textBody'] },
                        ],
                        [
                            { text: '7.', style: ['textBody', 'bgColor'] },
                            { text: 'Bidang Usaha Perseroan', style: ['textBody', 'bgColor'] },
                            dataKbli && dataKbli.length ?
                                dataKbli.map((val, index) => ({ text: `${val && val.code ? `${index + 1}.  ${val.code}` : ""}`, style: ["textBody"] }))
                                :
                                { text: '', style: ['textBody', 'bgColor'] },
                            { text: 'Sesuai Perka 19 Tahun 2017 Tentang Klasifikasi BakuLapangan Usaha Indonesia(KBLI)Nomor KBLI diurutkanberdasarkan prioritas utamabidang usaha perseroan', style: ['textBody'] },
                        ],
                        [
                            { text: '8.', style: ['textBody', 'bgColor'] },
                            { text: 'Jumlah Modal Disetor', style: ['textBody', 'bgColor'] },
                            { text: initial_capital && initial_capital.length ? initial_capital === "Kecil" ? "Lebih dari Rp 50 juta – Rp 500 juta" : initial_capital === "Menengah" ? "Lebih dari Rp 500 juta – Rp 10 Milliar" : "Lebih dari Rp 10 miliar" : "", style: ['textBody'] },
                            { text: `Modal disetor adalah modalyang disetorkan kerekeningperusahaan.Untuk modal disetor ${office_type || ""} minimal25% dari modal dasar, atauminimal sebesar 51 juta rupiah.Besaran modal disetor akanmempengaruhi SIUP yangnantinya diterbitkan. KlasifikasiSIUP: SIUP Kecil : minimalmodal disetorkanadalah 51 juta - 500juta SIUP Menengah :minimal modaldisetorkan adalah501juta - 10milyar SIUP besar: modaldisetor>10 milyar`, style: ['textBody'] },
                        ],
                        [
                            { text: '9.', style: ['textBody', 'bgColor'] },
                            { text: 'Jumlah Modal Dasar', style: ['textBody', 'bgColor'] },
                            { text: nominal_capital || "", style: ['textBody'] },
                            { text: `Modal dasar ialah keseluruhan nilai nominal saham. Untuk modal dasar ${office_type || ""} minimal 51 Juta rupiah.`, style: ['textBody'] },
                        ],
                        [
                            { text: '10.', style: ['textBody', 'bgColor'] },
                            { text: 'Harga per lembar saham', style: ['textBody', 'bgColor'] },
                            { text: shares || "", style: ['textBody'] },
                            { text: `Dalam Rp / lembar, harga harus angka bulat & tidak desimal`, style: ['textBody'] },
                        ],
                        [
                            { text: '11.', style: ['textBody', 'bgColor'] },
                            { text: 'Pemegang Saham dan Komposisinya', style: ['textBody', 'bgColor'] },
                            { text: shareholders || "", style: ['textBody'] },
                            { text: 'Mohon konfirmasi mengenai besaran persen (%) masingmasing pemegang saham (khususPT).', style: ['textBody'] },
                        ],
                        [
                            { text: '12.', style: ['textBody', 'bgColor'] },
                            { text: 'Susunan Pesero Aktif', style: ['textBody', 'bgColor'] },
                            { text: persero_aktif || "", style: ['textBody'] },
                            { text: 'Apabila direksi lebih dari 2 orangmaka mohon infokan siapa yangmenjadi Penanggungjawab', style: ['textBody'] },
                        ],
                        [
                            { text: '13.', style: ['textBody', 'bgColor'] },
                            { text: 'Susunan Pesero Pasif', style: ['textBody', 'bgColor'] },
                            { text: persero_pasif || "", style: ['textBody'] },
                            { text: '', style: ['textBody'] },
                        ],
                        [
                            { text: '14.', style: ['textBody', 'bgColor'] },
                            { text: 'Jumlah Karyawan', style: ['textBody', 'bgColor'] },
                            { text: number_employees || "", style: ['textBody'] },
                            { text: '', style: ['textBody'] },
                        ],
                        [
                            { text: '15.', style: ['textBody', 'bgColor'] },
                            { text: 'Pas Foto Direktur 3x4(4lembar, berlatarbelakang merah)', style: ['textBody', 'bgColor'] },
                            { text: "", style: ['textBody'] },
                            { text: '', style: ['textBody'] },
                        ]
                    ]
                }
            },
            { text: `CHECKLIST DOKUMEN - PENDIRIAN ${office_type || ""}.`, style: ['h1Title', { margin: [0, 30, 0, 0] }] },
            { text: `CHECK LIST PENDIRIAN ${office_type || ""}`, style: ['h1Title', 'h1Title2'] },
            {
                table: {
                    headerRows: 1,
                    widths: [15, "20%", "35%", "35%"],
                    body: [
                        [
                            { text: 'No', style: ["headerTable"] },
                            { text: 'Kelengkapan Berkas', style: ["headerTable"] },
                            [
                                { text: 'Ketersediaan', style: ["headerTable"] },
                                { text: 'Ada', style: ["headerTable"] }
                            ],
                            { text: 'Keterangan', style: ["headerTable"] },
                        ],
                        [
                            { text: '1.', style: ['textBody'] },
                            { text: 'Fotocopy KTP Para Pendiri', style: ['textBody'] },
                            { text: "", style: ["textBody"] },
                            { text: 'tidak suami istri (minimal 2 orang)', style: ["textBody"] },
                        ],
                        [
                            { text: '2.', style: ['textBody'] },
                            { text: 'Kartu Keluarga Direksi', style: ['textBody'] },
                            { text: "", style: ['textBody'] },
                            { text: 'Direktur Utama atau Direktur', style: ['textBody'] },
                        ],
                        [
                            { text: '3.', style: ['textBody'] },
                            { text: 'NPWP Para Pendiri', style: ['textBody'] },
                            { text: "", style: ['textBody'] },
                            { text: 'pemegang saham dan pengurus *NPWP sesuai format 2015 : Alamat dan NIK yang tercantum dalam NPWP telah sesuai dengan KTP', style: ['textBody'] },
                        ],
                        [
                            { text: '4.', style: ['textBody'] },
                            [
                                { text: 'a. Foto copy IMB tempat usaha', style: ["textBody"] },
                                { text: 'b. Foto copy PBB dan bukti pembayaran terakhirPPB tempat usaha;', style: ["textBody"] },
                                { text: 'c. Foto copy Surat Kontrak, apabila status kantorkontrak', style: ["textBody"] },
                                { text: 'd. Surat Keterangan Domisili dari pengelola gedung', style: ["textBody"] }
                            ],
                            [
                                { text: '', style: ["textBody"] },
                                { text: '', style: ["textBody"] },
                                { text: '', style: ["textBody"] },
                                { text: '', style: ["textBody"] }
                            ],
                            { text: 'Alamat yang digunakan untuk izin domisili.', style: ['textBody'] },
                        ],
                        [
                            { text: '5.', style: ['textBody'] },
                            { text: 'Stempeldan Logo Perusahaan', style: ['textBody'] },
                            { text: "", style: ['textBody'] },
                            { text: 'Bisa menyusul', style: ['textBody'] },
                        ]
                    ]
                }

            }
        ],
        defaultStyle: {
            font: 'Helvetica'
        },
        styles: {
            h1Title: {
                alignment: "center",
                fontSize: 14,
                bold: true,
                margin: [0, 10, 0, 20],
                fontWeight: "blod",
                font: 'Helvetica',
            },
            h1Title2: {
                decoration: 'underline',
                margin: [0, 10, 0, 5],
            },
            table: {
                // noBorders: false,
                // lightHorizontalLines: false
            },
            headerTable: {
                fillColor: "#afafc9",
                blod: true,
                fontSize: 8,
                alignment: "center",
                margin: [3, 0]
            },
            textBody: {
                fontSize: 7.5,
                margin: [0, 3],
                lineHeight: 1.5,
                characterSpacing: 0.5,
                alignment: 'justify'
            },
            bgColor: {
                fillColor: "#ededf7"
            }
        }
    };
    return docDefinition
}

