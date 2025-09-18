import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType } from 'docx';
import * as XLSX from 'xlsx';
import PDFDocument from 'pdfkit-table';

export const validateReportParams = (type, format) => {
	if (!['category', 'user', 'blog'].includes(type)) {
		throw new Error('Invalid report type');
	}
	if (!['pdf', 'excel', 'word'].includes(format)) {
		throw new Error('Invalid report format');
	}
};

export const formatRecordsForType = (type, data) => {
	return data.map(item => {
		switch (type) {
			case 'category':
				return {
					Name: item.name,
					Slug: item.slug,
					'Created At': new Date(item.createdAt).toLocaleDateString()
				};
			case 'user':
				return {
					Name: item.name,
					Email: item.email,
					Role: item.role,
					'Created At': new Date(item.createdAt).toLocaleDateString()
				};
			case 'blog':
				return {
					Title: item.title,
					Author: item.author.name,
					Category: item.category.name,
					'Created At': new Date(item.createdAt).toLocaleDateString()
				};
		}
	});
};

export const getHeadersForType = (type) => {
	switch (type) {
		case 'category':
			return ['Name', 'Slug', 'Created At'];
		case 'user':
			return ['Name', 'Email', 'Role', 'Created At'];
		case 'blog':
			return ['Title', 'Author', 'Category', 'Created At'];
	}
};

export const generateExcelBuffer = (formattedData) => {
	const ws = XLSX.utils.json_to_sheet(formattedData);
	const wb = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
	return XLSX.write(wb, { type: 'buffer', bookType: 'xls' });
};

export const generateWordBuffer = async (type, headers, formattedData) => {
	const doc = new Document({
		sections: [{
			properties: {},
			children: [
				new Paragraph({
					children: [
						new TextRun({ text: 'BlogHub', bold: true, size: 28, color: '2B580A' })
					],
					alignment: AlignmentType.CENTER,
					spacing: { after: 200 }
				}),
				new Paragraph({
					children: [
						new TextRun({ text: `${type.charAt(0).toUpperCase() + type.slice(1)} Report`, bold: true, size: 24 })
					],
					alignment: AlignmentType.CENTER,
					spacing: { after: 200 }
				}),
				new Table({
					width: { size: 100, type: WidthType.PERCENTAGE },
					rows: [
						new TableRow({
							children: headers.map(header => new TableCell({
								children: [new Paragraph({ children: [new TextRun({ text: header, bold: true })] })],
								width: { size: 100 / headers.length, type: WidthType.PERCENTAGE }
							}))
						}),
						...formattedData.map(row => new TableRow({
							children: Object.values(row).map(value => new TableCell({ children: [new Paragraph(value.toString())] }))
						}))
					]
				}),
				new Paragraph({
					children: [new TextRun({ text: 'BlogHub - Your Blogging Platform', color: '2B579A' })],
					alignment: AlignmentType.CENTER,
					spacing: { before: 200 }
				})
			]
		}]
	});
	return Packer.toBuffer(doc);
};

export const generatePdfBuffer = (type, headers, formattedData) => {
	return new Promise((resolve, reject) => {
		const pdfDoc = new PDFDocument({ size: 'A4', margin: 50 });
		const chunks = [];
		pdfDoc.on('data', chunk => chunks.push(chunk));
		pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
		pdfDoc.on('error', reject);

		pdfDoc.font('Helvetica-Bold').fontSize(24).fillColor('#2B579A').text('BlogHub', { align: 'center' }).moveDown();
		pdfDoc.fontSize(20).fillColor('#000000').text(`${type.charAt(0).toUpperCase() + type.slice(1)} Report`, { align: 'center' }).moveDown(2);

		const table = {
			title: `${type.charAt(0).toUpperCase() + type.slice(1)} Report`,
			headers: headers,
			rows: formattedData.map(row => Object.values(row))
		};

		pdfDoc.table(table, {
			prepareHeader: () => pdfDoc.font('Helvetica-Bold').fontSize(12),
			prepareRow: () => pdfDoc.font('Helvetica').fontSize(10),
			width: pdfDoc.page.width - 100,
			x: 50,
			y: pdfDoc.y
		});

		pdfDoc.font('Helvetica-Bold').fontSize(12).fillColor('#2B579A').text('BlogHub - Your Blogging Platform', pdfDoc.page.width / 2, pdfDoc.page.height - 50, { align: 'center' });
		pdfDoc.end();
	});
};


