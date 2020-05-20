import { LightningElement, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CurrentPageReference } from 'lightning/navigation';
import { fireEvent } from 'c/pubsub';

export default class AddTaxExemptions extends LightningElement {
    @api exemptions;
    monthlyHra = 0;
    annualHra = 0;
    investment = 0;
    donation = 0;
    maxInvestmentAllowed = 150000;
    @wire(CurrentPageReference) pageRef;

    connectedCallback(){
        this.monthlyHra = this.exemptions["monthlyHra"];
        this.annualHra = this.monthlyHra * 12;
        this.investment = this.exemptions["investment"];
        this.donation = this.exemptions["donation"];
    }

    handleChange(event){
        let name = event.target.name;
        if(name === 'monthlyHra'){
            this.monthlyHra = event.target.value;
            this.annualHra = this.monthlyHra * 12;
            this.dispatchEvent(new CustomEvent('monthlyhrachange', {detail : this.monthlyHra}));
            fireEvent(this.pageRef, 'monthlyHraChange', this.monthlyHra);
        } else if(name === 'investment'){
            this.investment = event.target.value;
            if(parseInt(this.investment) > parseInt(this.maxInvestmentAllowed)){
                this.showToast();
            }
            this.dispatchEvent(new CustomEvent('investmentchange', {detail : this.investment}));
            fireEvent(this.pageRef, 'investmentChange', this.investment);
        } else if(name === 'donation'){
            this.donation = event.target.value;
            this.dispatchEvent(new CustomEvent('donationchange', {detail : this.donation}));
            fireEvent(this.pageRef, 'donationChange', this.donation);
        }
    }

    showToast(){
        const evt = new ShowToastEvent({
            title: 'Attention',
            message: 'Total Investment under Section 80C can be maximum 1,50,000 INR. Declaring more than this amount will ignore excess amount at the time of tax computation.',
            variant: 'info',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }
}