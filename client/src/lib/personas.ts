export interface Persona {
    names: string;
    location: string;
    type: string;
    quote: string;
    highlight: string;
    impact: string;
    color: string;
}

export const personas: Persona[] = [
    {
        names: 'Priya & Amit',
        location: 'Mumbai',
        type: 'Arranged Marriage',
        quote: 'Traditional arranged marriage. 5 meetings before engagement. We discovered after our son was born that he needs blood transfusions every 3 weeks for life. A ₹1,500 test before marriage could have helped us make an informed choice.',
        highlight: 'We both carried Thalassemia Trait',
        impact: '₹40,000/month lifelong treatment',
        color: '#D4544C',
    },
    {
        names: 'Sneha & Rohan',
        location: 'Bangalore',
        type: 'Love Marriage',
        quote: 'We thought love was enough. Then we got screened and found my AMH was 0.8 and his sperm count was 12M — both treatable. If we had waited until "trying," we would have wasted 2 years and lakhs on IVF.',
        highlight: 'We dated 3 years but never discussed this',
        impact: 'Saved 2 years + ₹3–5 lakhs in IVF costs',
        color: '#111112',
    },
    {
        names: 'Kavita S.',
        location: 'Delhi',
        type: 'Remarriage',
        quote: 'Divorced at 32. My ex-husband had undiagnosed diabetes that became severe. This time I insisted both of us get screened. We discovered early. I will never go into marriage blind again.',
        highlight: 'My first marriage had hidden health issues',
        impact: 'Prevented repeated trauma, built trust',
        color: '#111112',
    },
    {
        names: 'Mrs. Sharma',
        location: 'Mother of Bride',
        type: 'Parent',
        quote: "The boy's family said 'everyone is healthy.' But what does that mean? This screening gave us actual data. Found both had Vitamin D deficiency — easily fixed before the wedding.",
        highlight: 'I wish this existed for my generation',
        impact: 'Data-driven decision for our family',
        color: '#5A5A60',
    },
];
