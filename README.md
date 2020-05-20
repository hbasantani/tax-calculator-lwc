# tax-calculator-lwc
Tax Calculator to help select the correct tax regime and plan investments to minimize tax. As per Indian Government Policies

**Pre-requisite** - My Domain should be enabled in the environment in order for the functionality to work.

**[Link](https://login.salesforce.com/packaging/installPackage.apexp?p0=04t2v000005tG0w)**

**References**
1. LWC Recipes (for pubsub module)
2. [LWC Guide](https://lwc.dev/guide/events)

**How it works**

The default regime selected is 'Old'. You can toggle between the Old and New Regime to check the computation. 

![Screenshot](https://github.com/hbasantani/tax-calculator-lwc/blob/master/Screenshots/Tax%20Calculator%20UI.png)
![Screenshot](https://github.com/hbasantani/tax-calculator-lwc/blob/master/Screenshots/Tax%20Calculator%20UI%20-%20New.png)

You can add exemption factors like Rent paid, Investment details, donation made by clicking on 'Add Tax Exemption Details' under the Old Regime. This option is not available under the New Regime. 

Click on 'Show Tax Calculation' to view the tax computation.

![Screenshot](https://github.com/hbasantani/tax-calculator-lwc/blob/master/Screenshots/Tax%20Computation%20-%20Old%20Regime.png)
![Screenshot](https://github.com/hbasantani/tax-calculator-lwc/blob/master/Screenshots/Tax%20Computation%20-%20%20New%20Regime.png)

If the PF Amount is different from the computation, select PF amount is different and enter the value.

![Screenshot](https://github.com/hbasantani/tax-calculator-lwc/blob/master/Screenshots/Tax%20Computation%20with%20Fixed%20PF%20-%20Old.png)

Following validations are currently in place for variable component, basic pay and HRA. If Investment amount mentioned is more than 1,50,000, an alert is displayed and 1,50,000 is considered for calculation.

![Screenshot](https://github.com/hbasantani/tax-calculator-lwc/blob/master/Screenshots/Validations.png)
![Screenshot](https://github.com/hbasantani/tax-calculator-lwc/blob/master/Screenshots/Investment%20Alert.png)

**Future Scope-**
1. Show Comparison of the two regimes and suggest further tax saving options.
2. Save(as PDF or as a record) the computation so that it can be re-visited at a later point.
3. Show a list recent computations and allow to select one of the computations in order to further modify the values and check the results.
