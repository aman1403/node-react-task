import PdfTable from 'voilab-pdf-table'
import PdfDocument from 'pdfkit';

module.exports = {
    create: (data) => {
        const pdf = new PdfDocument({ autoFirstPage: false, size: 'A4', layout: 'landscape' }),
        table = new PdfTable(pdf, { buttomMargin: 10 });
        table.addPlugin(new (require('voilab-pdf-table/plugins/fitcolumn'))({
        column: 'S.No.' + 'firstName' + 'lastName' + 'email' + 'phoneNumber' + 'location' ,
        })).setColumnsDefaults({
        // headerBorder: ['L','T','B','R'],
        border: ['L','T','B','R'],
        align: 'center',
        valign: 'center',
        lineGap: 3,
        }).addColumns([
        {
            id: 'S.No.',
            header: 'S.No.',
            width: 40,
        },
        {
            id: 'firstName',
            header: 'firstName',
            width: 80,
        },
        {
            id: 'lastName',
            header: 'lastName',
            width: 80,
        },
        {
            id: 'email',
            header: 'email',
            width: 120,
        },
        {
            id: 'phoneNumber',
            header: 'phoneNumber',
            width: 100,
        },
        {
            id: 'city',
            header: 'city',
            width: 100,
        },
        {
            id: 'address',
            header: 'address',
            width: 100,
        },
        {
            id: 'socialLink',
            header: 'socialLink',
            width: 100,
        }
        ]).onPageAdded(tb => (tb.addHeader()));

        pdf.addPage();

        // pdf.text(`some text`, { align: 'center' });
        // pdf.moveDown().text(`some text`, { align: 'center' });
        pdf.moveDown();

        // table.addBody(worklog.sort((a , b) => moment(a.date).valueOf() - moment(b.date).valueOf()));

        // The following Text is in the last column but should under the table
        // pdf.moveDown().text(`some text`, { align: 'center' });
        table.addBody(data);
        return pdf
    }
}