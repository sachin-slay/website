export const getLandingSchema = () => {
    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Organization',
                '@id': 'https://slay.health/#organization',
                name: 'Slay Health',
                url: 'https://slay.health',
                logo: {
                    '@type': 'ImageObject',
                    url: 'https://slay.health/images/logo.webp',
                    width: '112',
                    height: '112',
                },
                description: 'Premarital health compatibility screening for couples in India. Genetic testing, fertility assessment, and clinical review.',
                sameAs: [],
            },
            {
                '@type': 'WebApplication',
                '@id': 'https://slay.health/#webapplication',
                name: 'Slay Health Premarital Screening Engine',
                url: 'https://slay.health',
                applicationCategory: 'HealthApplication',
                operatingSystem: 'All',
                offers: {
                    '@type': 'AggregateOffer',
                    priceCurrency: 'INR',
                    lowPrice: '799',
                    highPrice: '2499',
                    offerCount: '3',
                },
                description:
                    "India's premarital health compatibility screening engine for couples. Clinical safety, doctor review, and genetic tests across 6 pillars.",
            },
            {
                '@type': 'MedicalBusiness',
                '@id': 'https://slay.health/#medical',
                name: 'Slay Health Screening',
                description: 'Premarital health screening and genetic compatibility testing for couples.',
                areaServed: 'India',
                priceRange: '₹799 - ₹2,499',
            },
        ],
    };
};
