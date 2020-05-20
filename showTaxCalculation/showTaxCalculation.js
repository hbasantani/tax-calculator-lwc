import { LightningElement, api, wire } from 'lwc';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';

export default class ShowTaxCalculation extends LightningElement {
    @api taxCalculationFactors;
    @api exemptions;
    @wire(CurrentPageReference) pageRef;
    isTaxRegimeOld = false;
    totalPfAmount;
    taxAmount = 0;
    taxPerMonth = 0;
    netInHandAnnual;
    netMonthlyInHand;
    totalHra = 0;
    standardDeduction = 50000;
    totalInvestment = 0;
    donationUnder80G = 0;
    //annualAmountMinusPf = 0;
    professionTax = 2400;

    connectedCallback(){
        registerListener('monthlyHraChange', this.handleMonthlyHraChange, this);
        registerListener('investmentChange', this.handleInvestmentChange, this);
        registerListener('donationChange', this.handleDonationChange, this);
        this.isTaxRegimeOld = this.taxCalculationFactors["taxRegime"] === 'Old';
        this.calculate();
    }
    
    disconnectedCallback() {
        unregisterAllListeners(this);
    }

    @api calculate(){
        let factors = this.taxCalculationFactors;
        let exemptions = this.exemptions;
        this.totalPfAmount = factors["pfAmount"] * 2;
        if(factors["taxRegime"] === 'Old'){
            this.handleMonthlyHraChange(exemptions["monthlyHra"]);
            this.handleInvestmentChange(exemptions["investment"]);
            this.handleDonationChange(exemptions["donation"]);
        } else if(factors["taxRegime"] === 'New'){
            this.calculateTaxNew();
            this.calculateNetValues();
        }
    }

    handleMonthlyHraChange(monthlyHraValue){
        let lowestHraAmount = 0;
        let monthlyHraRcvd = this.taxCalculationFactors["hra"]/12;
        let monthlyBasic =  this.taxCalculationFactors["basicPay"]/12;
        
        if(monthlyHraValue === '' || parseInt(monthlyHraValue) === 0){
            this.totalHra = 0;
        } else if(monthlyHraValue > 0){
            //First find the lesser of HRA and 40% of Basic
            lowestHraAmount = monthlyHraRcvd < monthlyBasic * 0.40 ?
                            monthlyHraRcvd : monthlyBasic * 0.40;
            //Then find if Actual rent paid - 10% of basic is lesser
            lowestHraAmount = lowestHraAmount < (monthlyHraValue - monthlyBasic*0.10) ?
                            lowestHraAmount : (monthlyHraValue - monthlyBasic*0.10);
            if(lowestHraAmount > 0){
                this.totalHra = lowestHraAmount * 12;
            } else{
                this.totalHra = 0;
            }
        }
        this.calculateTaxOld();
        this.calculateNetValues();
    }

    handleInvestmentChange(totalInvestmentValue){
        if(totalInvestmentValue === '' || parseInt(totalInvestmentValue) === 0){
            this.totalInvestment = 0;
        } else if(parseFloat(totalInvestmentValue) > 0 && parseFloat(totalInvestmentValue) <= 150000){
            this.totalInvestment = parseFloat(totalInvestmentValue) > 150000 ? 150000 : totalInvestmentValue;
        } else if(parseFloat(totalInvestmentValue) > 150000){
            this.totalInvestment = 150000;
        }    
        this.calculateTaxOld();
        this.calculateNetValues();    
    }

    handleDonationChange(donationValue){
        if(donationValue === ''){
            this.donationUnder80G = 0;
        }else{
            this.donationUnder80G = donationValue;
        }
        this.calculateTaxOld();
        this.calculateNetValues();
    }

    calculateTaxOld(){
        let annualAmountMinusPf = this.taxCalculationFactors["fixedComp"] - this.taxCalculationFactors["pfAmount"];   
        let netTaxableSalary = parseFloat(annualAmountMinusPf) - (parseFloat(this.totalHra) + parseFloat(this.totalInvestment) + parseFloat(this.donationUnder80G) + parseFloat(this.standardDeduction));
        netTaxableSalary = netTaxableSalary - this.professionTax;
        if(parseInt(netTaxableSalary) > 1000000){
            this.taxAmount = (250000 * 0.05) + (500000 * 0.20);
            this.taxAmount += (netTaxableSalary - 1000000) * 0.3;
        } else if(parseInt(netTaxableSalary) > 500000){
            this.taxAmount = (250000 * 0.05);
            this.taxAmount += (netTaxableSalary - 500000) * 0.2;
        } else if(parseInt(netTaxableSalary) > 250000){
            this.taxAmount = (netTaxableSalary- 250000) * 0.05;
            //Rebate under 87A
            this.taxAmount = 0;
        }
        this.taxPerMonth = this.taxAmount/12;
    }

    calculateTaxNew(){
        let annualAmountMinusPf = this.taxCalculationFactors["fixedComp"] - this.taxCalculationFactors["pfAmount"];   
        let netTaxableSalary = parseFloat(annualAmountMinusPf) - this.professionTax;
        if(parseInt(netTaxableSalary) > 1500000){
            this.taxAmount = (250000 * 0.05) + (250000 * 0.1) + (250000 * 0.15) + (250000 * 0.20) + (250000 * 0.25);
            this.taxAmount += (netTaxableSalary - 1500000) * 0.3;
        } else if(parseInt(netTaxableSalary) > 1250000){
            this.taxAmount = (250000 * 0.05) + (250000 * 0.1) + (250000 * 0.15) + (250000 * 0.20);
            this.taxAmount += (netTaxableSalary - 1250000) * 0.25;
        } else if(parseInt(netTaxableSalary) > 1000000){
            this.taxAmount = (250000 * 0.05) + (250000 * 0.1) + (250000 * 0.15);
            this.taxAmount += (netTaxableSalary - 1000000) * 0.20;
        } else if(parseInt(netTaxableSalary) > 750000){
            this.taxAmount = (250000 * 0.05) + (250000 * 0.1);
            this.taxAmount += (netTaxableSalary - 750000) * 0.15;
        } else if(parseInt(netTaxableSalary) > 500000){
            this.taxAmount = (250000 * 0.05) + ((netTaxableSalary - 500000) * 0.10);
        }  else if(parseInt(netTaxableSalary) > 250000){
            this.taxAmount = (netTaxableSalary - 250000) * 0.05;
            //Rebate under 87A
            this.taxAmount = 0;
        }
        this.taxPerMonth = this.taxAmount/12;    
    }
    calculateNetValues(){
        this.netInHandAnnual = this.taxCalculationFactors["fixedComp"] - this.totalPfAmount - this.taxAmount - this.professionTax;
        if(this.netInHandAnnual < 0){
            this.netInHandAnnual = 0;
            this.professionTax = 0;
            this.standardDeduction = 0;
        } else{
            this.netMonthlyInHand = this.netInHandAnnual/12;
        }
    }
}