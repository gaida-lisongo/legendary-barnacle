require('dotenv').config();

class MoneyManager {
    constructor() {
        this.payment = process.env.FLEX_HOST;
        this.check = process.env.FLEX_CHECK;
        this.token = process.env.FLEX_TOKEN;
        this.merchant = process.env.FLEX_MERCHANT;
    }

    async createTransaction({amount, currency, reference, phone}) {
        const payload = {
            callbackUrl: "https://btp-sections.netlify.app/success",
            merchant: this.merchant,
            amount: amount,
            currency: currency,
            description: "Paiement de frais de scolarité",
            type: "1",
            reference: reference,
            phone: phone
        }

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${this.token}`
            },
            body: JSON.stringify(payload)
        };

        try {
            const response = await fetch(this.payment, requestOptions);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error creating transaction:', error);
            throw error;
        }
    }

    async checkTransaction({orderNumber}) {
        const url = `${this.check}${orderNumber}`;
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.token
            }
        };

        const response = await fetch(url, requestOptions);
        const data = await response.json();
        return data;
    }


}

module.exports = new MoneyManager();