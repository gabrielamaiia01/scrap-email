const axios = require('axios');
const cheerio = require('cheerio');
const nodemailer = require('nodemailer');

// Configuração de email
const SMTP_SERVER = 'smtp.gmail.com';
const SMTP_PORT = 587;
const EMAIL = 'gsmws111@gmail.com';
const PASSWORD = 'nlqgvcpzhdcjoomc';  // Utilize a senha de aplicativo gerada

async function scrapeData() {
    const url = 'https://www.mercadolivre.com.br/samsung-galaxy-s23-256-gb-5g-preto-8-gb-ram/p/MLB21436188';
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const title = $('h1.ui-pdp-title').text().trim();
        const price = parseFloat($('span.andes-money-amount__fraction').text().trim()).toFixed(3);
        const color = $('#picker-label-COLOR').text().trim() || 'Cor não encontrada';

        return { title, price, color };
    } catch (error) {
        console.error('Erro no scraping:', error);
        throw error;
    }
}

async function sendEmail(title, price, color) {
    const transporter = nodemailer.createTransport({
        host: SMTP_SERVER,
        port: SMTP_PORT,
        secure: false, 
        auth: {
            user: EMAIL,
            pass: PASSWORD
        }
    });

    const mailOptions = {
        from: `"Scraper Bot" <${EMAIL}>`,
        to: 'gabrielamaiia01@gmail.com',
        subject: 'Detalhes do Produto',
        text: `
        Detalhes do Produto:
        - Título: ${title}
        - Preço: R$ ${price}
        - Cor: ${color}
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email enviado com sucesso!');
    } catch (error) {
        console.error('Erro no envio de email:', error);
        throw error;
    }
}

async function main() {
    try {
        const { title, price, color } = await scrapeData();
        await sendEmail(title, price, color);
    } catch (error) {
        console.error('Erro na execução principal:', error);
    }
}

main();
