import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class TaxCalculator extends LightningElement {
    taxRegimeValue = 'Old';
    annualSalary = 0;
    variableComp = 0;
    fixedComp = 0;
    basicPay = 0;
    fixedPfAmount = false;
    pfAmount = 0;
    calculatedPfAmount = 0;
    pfPerMonth = 0;
    showCalculation = false;
    showTaxExemptionDetails = false;
    hra = 0;
    transport = 0;
    medical = 0;
    special = 0;

    @track factors = {"fixedComp": "0", "basicPay":"0",
                      "pfAmount":"0", "taxRegime":"Old", "hra":"0",};
    @track exemptions = {"monthlyHra":"0", "investment":"0", "donation":"0"};
    get taxRegimeOptions() {
        return [
            { label: 'Old', value: 'Old' },
            { label: 'New', value: 'New' },
        ];
    }
    
    handleTaxRegimeChange(event){
        this.taxRegimeValue = event.target.value;
        this.factors["taxRegime"] = this.taxRegimeValue;   
        this.showCalculation = false;     
    }
    get isTaxRegimeOld(){
        return `${this.taxRegimeValue}` === 'Old';
    }
    
    performCalculation(event){
        let name = event.target.name;
        if(name === 'annualSalary'){
            this.annualSalary = event.target.value;
            this.fixedComp = this.annualSalary - this.variableComp;
            this.factors["fixedComp"] = this.fixedComp;
            this.handleCustomValidation();
        } else if(name === 'variableComp'){
            this.variableComp = event.target.value;
            this.fixedComp = this.annualSalary - this.variableComp;
            this.factors["fixedComp"] = this.fixedComp;
            this.handleCustomValidation();
        } else if(name === 'basicPay'){
            this.basicPay = event.target.value;
            this.factors["basicPay"] = this.basicPay;
            this.calculatedPfAmount = this.fixedPfAmount == false ? this.basicPay * 0.12 : this.calculatedPfAmount;
            this.pfPerMonth = this.fixedPfAmount == false ? this.calculatedPfAmount / 12 : this.pfAmount / 12;
            this.resetValidation('basicPay');
        } else if(name === 'pfAmountCheck'){
            this.fixedPfAmount = event.target.checked;
            this.calculatedPfAmount = this.fixedPfAmount == false ? this.basicPay * 0.12 : this.calculatedPfAmount;
            this.pfPerMonth = this.fixedPfAmount == false ? this.calculatedPfAmount / 12 : this.pfAmount / 12;
        } else if(name === 'pfAmount'){
            this.pfAmount = event.target.value;
            this.pfPerMonth = this.pfAmount / 12;
        } else if(name === 'hra'){
            this.hra = event.target.value;
            this.factors["hra"] = this.hra;
            this.resetValidation('hra');
        } 
        if(this.fixedPfAmount == true){
            this.factors["pfAmount"] = this.pfAmount;
        } else{
            this.factors["pfAmount"] = this.calculatedPfAmount;
        }
        this.factors["taxRegime"] = this.taxRegimeValue;   
        if(this.template.querySelector('c-show-tax-calculation') !== null){
            this.template.querySelector('c-show-tax-calculation').calculate();   
        }        
    }

    handleCustomValidation() {
        let variableComp = this.template.querySelector(".variableComp"); 
        let annualSalaryComp = this.template.querySelector(".annualSalary"); 
        if(this.annualSalary === '' || parseInt(this.annualSalary) < 0){
            //set an error
            annualSalaryComp.setCustomValidity("Enter a valid positive value");
            annualSalaryComp.reportValidity();
        } else{
           //reset an error
           annualSalaryComp.setCustomValidity('');
           annualSalaryComp.reportValidity();  
        }
        if(parseInt(this.variableComp) > parseInt(this.annualSalary)) {
            //set an error
            variableComp.setCustomValidity("Variable Component cannot be more than Total Annual Salary");
            variableComp.reportValidity();
        }else if(parseInt(this.variableComp) < 0){
            variableComp.setCustomValidity("Enter a valid positive value.");
            variableComp.reportValidity();
        } else {         
            //reset an error
            variableComp.setCustomValidity('');
            variableComp.reportValidity(); 
           
        }
    }

    resetValidation(compName){
        let comp = this.template.querySelector("."+compName); 
        if(compName === 'basicPay'){
            if(parseInt(this.basicPay) > 0){
                comp.setCustomValidity('');
                comp.reportValidity();                
            }
        } else if(compName === 'hra'){
            if(parseInt(this.hra) > 0){
                comp.setCustomValidity('');
                comp.reportValidity();     
            }
        }        
    }

    showTaxCalculation(){
        if(this.annualSalary === '' || parseInt(this.annualSalary) === 0){
            const evt = new ShowToastEvent({
                title: 'Error',
                message: 'Enter Annual Salary before checking the Tax Calculation',
                variant: 'error',
                mode: 'dismissable'
            });
            this.dispatchEvent(evt);
        } else{
            this.showCalculation = true;
        }
    }

    hideTaxCalculation(){
        this.showCalculation = false;
    }

    showTaxExemptionComp(){
        this.showTaxExemptionDetails = true;
    }

    handleHraChange(event){
        this.exemptions["monthlyHra"] = event.detail;
        if(parseInt(this.basicPay) === 0){
            let basicComp=this.template.querySelector(".basicPay"); 
            basicComp.setCustomValidity("Basic pay should be mentioned in order to show correct HRA computation.");
            basicComp.reportValidity();
        }
        if(parseInt(this.hra) === 0){
            let hraComp=this.template.querySelector(".hra"); 
            hraComp.setCustomValidity("HRA should be mentioned in order to show correct HRA computation.");
            hraComp.reportValidity(); 
        }
        /*if(this.template.querySelector('c-show-tax-calculation') !== null){
            this.template.querySelector('c-show-tax-calculation').calculate();
        }*/
    }

    handleInvestmentChange(event){
        this.exemptions["investment"] = event.detail;
        /*if(this.template.querySelector('c-show-tax-calculation') !== null){
            this.template.querySelector('c-show-tax-calculation').calculate();
        }*/
    }

    handleDonationChange(event){
        this.exemptions["donation"] = event.detail;
        /*if(this.template.querySelector('c-show-tax-calculation') !== null){
            this.template.querySelector('c-show-tax-calculation').calculate();
        }*/
    }

}