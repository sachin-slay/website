import React from 'react';

// ── Shared Components ──

const BarChart = ({ data }: { data: { label: string; value: number; color: string }[] }) => (
  <div className="space-y-3">
    {data.map((item) => (
      <div key={item.label}>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-slate-700">{item.label}</span>
          <span className="font-semibold" style={{ color: item.color }}>{item.value}%</span>
        </div>
        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }}></div>
        </div>
      </div>
    ))}
  </div>
);

const InfoBox = ({ title, titleColor, items }: { title: string; titleColor: string; items: { stat: string; desc: string }[] }) => (
  <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 lg:p-6">
    <h4 className={`text-sm font-bold uppercase tracking-wider mb-4 ${titleColor}`}>{title}</h4>
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-3">
          <span className="text-base lg:text-lg font-bold font-mono text-slate-800 flex-shrink-0 min-w-[70px]">{item.stat}</span>
          <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

const CostComparison = ({ checkCost, checkLabel, fixCost, fixLabel, multiplier }: {
  checkCost: string; checkLabel: string; fixCost: string; fixLabel: string; multiplier: string;
}) => (
  <div className="space-y-3">
    <div className="border border-green-200 rounded-xl p-4 flex items-center gap-3">
      <span className="text-green-600 text-lg">✓</span>
      <div>
        <p className="text-2xl font-bold text-green-600">{checkCost}</p>
        <p className="text-sm text-slate-500">{checkLabel}</p>
      </div>
    </div>
    <p className="text-center text-slate-400 font-bold text-sm">vs</p>
    <div className="border border-red-200 rounded-xl p-4 flex items-center gap-3">
      <span className="text-red-500 text-lg">✗</span>
      <div>
        <p className="text-2xl font-bold text-red-500">{fixCost}</p>
        <p className="text-sm text-slate-500">{fixLabel}</p>
      </div>
    </div>
    <div className="bg-red-50 border border-red-200 rounded-lg py-2 px-4 text-center">
      <p className="text-sm">That's <strong className="text-red-500">{multiplier}</strong> than catching it early</p>
    </div>
  </div>
);

// ── Story 1: Infertility ──

export const InfertilityVisual = () => (
  <div>
    <p className="text-center font-script text-base mb-3 text-slate-500">What infertility does to women</p>
    <BarChart data={[
      { label: 'Depression', value: 56, color: '#ef4444' },
      { label: 'Severe Stress', value: 88, color: '#ef4444' },
      { label: 'Anxiety', value: 76, color: '#f59e0b' },
      { label: 'Marital Conflict', value: 62, color: '#3b82f6' },
    ]} />
  </div>
);

export const InfertilityBoxes = () => (
  <div className="grid lg:grid-cols-2 gap-5">
    <InfoBox
      title="♀ HER REALITY"
      titleColor="text-pink-600"
      items={[
        { stat: '1 in 5', desc: 'Indian women have PCOS — the #1 cause of female infertility' },
        { stat: '70%', desc: "don't know they have it until they start trying to conceive" },
        { stat: '56%', desc: 'of women facing infertility develop clinical depression' },
      ]}
    />
    <InfoBox
      title="♂ HIS REALITY"
      titleColor="text-orange-600"
      items={[
        { stat: '72%', desc: 'of men visiting fertility clinics have abnormal sperm parameters' },
        { stat: '30%', desc: 'decline in Indian male sperm quality in just 13 years' },
        { stat: '15 min', desc: 'is all a semen analysis takes — yet men test last, years later' },
      ]}
    />
  </div>
);

export const InfertilityCost = () => (
  <CostComparison
    checkCost="₹2,999"
    checkLabel="Complete fertility baseline"
    fixCost="₹8-15L"
    fixLabel="IVF cycles + medications + emotional cost"
    multiplier="50x more"
  />
);

// ── Story 2: STDs & STIs ──

export const STDVisual = () => (
  <div>
    <p className="text-center font-script text-base mb-3 text-slate-500">Asymptomatic carrier rates</p>
    <div className="grid grid-cols-2 gap-3">
      {[
        { name: 'HPV', rate: '90%' },
        { name: 'Chlamydia', rate: '75%' },
        { name: 'Hepatitis B', rate: '70%' },
        { name: 'Herpes', rate: '80%' },
      ].map((item) => (
        <div key={item.name} className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-orange-500">{item.rate}</p>
          <p className="text-xs text-slate-500 mt-1">{item.name}</p>
          <p className="text-xs text-slate-400">show no symptoms</p>
        </div>
      ))}
    </div>
  </div>
);

export const STDBoxes = () => (
  <div className="grid lg:grid-cols-2 gap-5">
    <InfoBox
      title="⚠️ THE SILENT CARRIERS"
      titleColor="text-orange-600"
      items={[
        { stat: '4 Cr', desc: "Indians are Hepatitis B carriers — most don't know" },
        { stat: '90%', desc: 'of HPV infections show no symptoms in men' },
        { stat: '1 in 3', desc: 'sexually active adults will contract an STI before age 25' },
      ]}
    />
    <InfoBox
      title="😤 WHAT NOBODY DISCUSSES"
      titleColor="text-red-600"
      items={[
        { stat: '0%', desc: 'of arranged marriages include STD screening in the process' },
        { stat: '₹50K-5L', desc: 'lifetime treatment cost for chronic Hepatitis B' },
        { stat: '70%', desc: 'of cervical cancers are caused by HPV — preventable with a vaccine' },
      ]}
    />
  </div>
);

export const STDCost = () => (
  <CostComparison
    checkCost="₹1,500"
    checkLabel="Complete STI panel"
    fixCost="₹50K-5L+"
    fixLabel="Chronic treatment + partner infection risk"
    multiplier="30x more"
  />
);

// ── Story 3: Chronic Disease ──

export const ChronicVisual = () => (
  <div>
    <p className="text-center font-script text-base mb-3 text-slate-500">Undiagnosed rates in India</p>
    <BarChart data={[
      { label: 'Diabetes (undiagnosed)', value: 50, color: '#3b82f6' },
      { label: 'Hypertension', value: 45, color: '#3b82f6' },
      { label: 'Thyroid disorders', value: 40, color: '#3b82f6' },
      { label: 'Mental health conditions', value: 80, color: '#3b82f6' },
    ]} />
  </div>
);

export const ChronicBoxes = () => (
  <div className="grid lg:grid-cols-2 gap-5">
    <InfoBox
      title="🏥 THE HIDDEN EPIDEMIC"
      titleColor="text-blue-600"
      items={[
        { stat: '10.1 Cr', desc: 'Indians have diabetes — half are undiagnosed' },
        { stat: '1 in 8', desc: 'Indian adults have a thyroid disorder, mostly women' },
        { stat: '30%', desc: 'of Indians aged 25-34 have hypertension' },
      ]}
    />
    <InfoBox
      title="🧠 MENTAL HEALTH: THE TABOO"
      titleColor="text-purple-600"
      items={[
        { stat: '15 Cr', desc: 'Indians need mental health support — 80% never seek it' },
        { stat: '1 in 5', desc: 'marriages are severely impacted by undisclosed mental health conditions' },
        { stat: '3x', desc: 'higher divorce risk when mental health conditions are hidden pre-marriage' },
      ]}
    />
  </div>
);

export const ChronicCost = () => (
  <CostComparison
    checkCost="₹2,999"
    checkLabel="Full metabolic + mental health screening"
    fixCost="₹2-10L/yr"
    fixLabel="Ongoing treatment + lifestyle disruption"
    multiplier="30x more"
  />
);

// ── Story 4: Genetic Disorders ──

export const GeneticVisual = () => (
  <div>
    <p className="text-center font-script text-base mb-3 text-slate-500">If both parents are carriers...</p>
    <div className="flex justify-center">
      <table className="border-collapse">
        <thead>
          <tr>
            <td className="p-2"></td>
            <td className="p-2 text-center font-bold text-sm">A</td>
            <td className="p-2 text-center font-bold text-sm text-red-400">a</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2 font-bold text-sm">A</td>
            <td className="p-2"><div className="w-14 h-14 rounded-lg bg-blue-100 flex items-center justify-center font-bold text-blue-700">AA</div></td>
            <td className="p-2"><div className="w-14 h-14 rounded-lg bg-orange-100 flex items-center justify-center font-bold text-orange-600">Aa</div></td>
          </tr>
          <tr>
            <td className="p-2 font-bold text-sm text-red-400">a</td>
            <td className="p-2"><div className="w-14 h-14 rounded-lg bg-orange-100 flex items-center justify-center font-bold text-orange-600">Aa</div></td>
            <td className="p-2"><div className="w-14 h-14 rounded-lg bg-red-100 flex items-center justify-center font-bold text-red-600">aa</div></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div className="flex justify-center gap-4 text-xs text-slate-500 mt-3">
      <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-100 rounded-full"></span> Healthy</span>
      <span className="flex items-center gap-1"><span className="w-3 h-3 bg-orange-100 rounded-full"></span> Carrier</span>
      <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-100 rounded-full"></span> Affected</span>
    </div>
  </div>
);

export const GeneticBoxes = () => (
  <div className="grid lg:grid-cols-2 gap-5">
    <InfoBox
      title="🚨 THE MATH NOBODY DOES"
      titleColor="text-red-600"
      items={[
        { stat: '1 in 25', desc: 'Indians is a Thalassemia carrier — completely healthy, zero symptoms' },
        { stat: '25%', desc: 'chance of severely affected child if both parents are carriers' },
        { stat: '10,000+', desc: 'children born with Thalassemia Major in India every year' },
      ]}
    />
    <InfoBox
      title="❤️ THE LIFETIME COST"
      titleColor="text-pink-600"
      items={[
        { stat: '₹3-5L', desc: 'per year for blood transfusions and iron chelation therapy' },
        { stat: 'Monthly', desc: 'hospital visits for the child — every month, for life' },
        { stat: '₹20-50L', desc: 'for a bone marrow transplant — if a donor is even found' },
      ]}
    />
  </div>
);

export const GeneticCost = () => (
  <CostComparison
    checkCost="₹500"
    checkLabel="Simple blood test (CBC + HbA2)"
    fixCost="₹3-5L/yr"
    fixLabel="Lifetime transfusions + chelation"
    multiplier="100x more"
  />
);
