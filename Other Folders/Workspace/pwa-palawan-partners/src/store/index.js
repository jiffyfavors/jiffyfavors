import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)
const store = new Vuex.Store({
    plugins: [createPersistedState()],
    state: {
        cart: [],
        cartID: '',
        partners: [],
           data: {},
        isAuth: false,
  
         lastloggedin:0,
        
        areas: [{
            "code": "ELN",
            "locations": [{
                "name": "Hotel in Corong Corong Area",
                "rate": 0
            }, {
                "name": "El Nido Bus Terminal",
                "rate": 0
            }, {
                "name": "Lio Estate or Villa Libertad Area",
                "rate": 850
            }, {
                "name": "El Nido Cove Resort",
                "rate": 1200
            }, {
                "name": "Nacpan & Bucana Area",
                "rate": 1800
            }, {
                "name": "Duli Beach",
                "rate": 2500
            }, {
                "name": "San Fernando & Sibaltan Area",
                "rate": 3000
            }]
        }, {
            "code": "PPS",
            "locations": [{
                "name": "Puerto Princesa International Airport(PPS)",
                "rate": 0
            }, {
                "name": "Hotel in Puerto Princesa City Center",
                "rate": 0
            }, {
                "name": "PPS North Area",
                "rate": 0
            }, {
                "name": "Sabang Area",
                "rate": 0
            }]
        }, {
            "code": "SAB",
            "locations": [{
                "name": "Sabang Beach",
                "rate": 0
            }, {
                "name": "Sabang Wharf",
                "rate": 0
            }, {
                "name": "Daluyon Beach & Mountain Resort",
                "rate": 100
            }, {
                "name": "Sheridan Beach Resort & Spa",
                "rate": 100
            }]
        }, {
            "code": "SVC",
            "locations": [{
                "name": "Poblacion, San Vicente",
                "rate": 0
            }, {
                "name": "San Vicente Airport(SWL)",
                "rate": 0
            }, {
                "name": "San Vicente Van Terminal",
                "rate": 0
            }, {
                "name": "Brgy. Alimanguhan",
                "rate": 500
            }, {
                "name": "Panindigan",
                "rate": 500
            }]
        }, {
            "code": "PBT",
            "locations": [{
                "name": "Port Barton Common Terminal",
                "rate": 0,
            }, {
                "name": "Hotel in Port Barton",
                "rate": 100,
            }]

        }],
        services: [],
        search: {
            origin: 'PPS',
            desti: 'ELN',
            traveldate: new Date().toISOString().substr(0, 10),
            pax: 2
        },
        contactSheet: false,
        bookings: [],
        currency: 'PHP',
        trans_details: {},
        revCount: {
            taDs: 80,
            taPV: 44
        },
        mode: false,
        currentUser: {},
        trans_result: [],
        tour_result: [],
        exchange: [],
        wishlist: [],
        nationality: [
            "Afghan",
            "Albanian",
            "Algerian",
            "American",
            "Andorran",
            "Angolan",
            "Antiguans",
            "Argentinean",
            "Armenian",
            "Australian",
            "Austrian",
            "Azerbaijani",
            "Bahamian",
            "Bahraini",
            "Bangladeshi",
            "Barbadian",
            "Barbudans",
            "Batswana",
            "Belarusian",
            "Belgian",
            "Belizean",
            "Beninese",
            "Bhutanese",
            "Bolivian",
            "Bosnian",
            "Brazilian",
            "British",
            "Bruneian",
            "Bulgarian",
            "Burkinabe",
            "Burmese",
            "Burundian",
            "Cambodian",
            "Cameroonian",
            "Canadian",
            "Cape Verdean",
            "Central African",
            "Chadian",
            "Chilean",
            "Chinese",
            "Colombian",
            "Comoran",
            "Congolese",
            "Costa Rican",
            "Croatian",
            "Cuban",
            "Cypriot",
            "Czech",
            "Danish",
            "Djibouti",
            "Dominican",
            "Dutch",
            "East Timorese",
            "Ecuadorean",
            "Egyptian",
            "Emirian",
            "Equatorial Guinean",
            "Eritrean",
            "Estonian",
            "Ethiopian",
            "Fijian",
            "Filipino",
            "Finnish",
            "French",
            "Gabonese",
            "Gambian",
            "Georgian",
            "German",
            "Ghanaian",
            "Greek",
            "Grenadian",
            "Guatemalan",
            "Guinea-Bissauan",
            "Guinean",
            "Guyanese",
            "Haitian",
            "Herzegovinian",
            "Honduran",
            "Hungarian",
            "I-Kiribati",
            "Icelander",
            "Indian",
            "Indonesian",
            "Iranian",
            "Iraqi",
            "Irish",
            "Israeli",
            "Italian",
            "Ivorian",
            "Jamaican",
            "Japanese",
            "Jordanian",
            "Kazakhstani",
            "Kenyan",
            "Kittian and Nevisian",
            "Kuwaiti",
            "Kyrgyz",
            "Laotian",
            "Latvian",
            "Lebanese",
            "Liberian",
            "Libyan",
            "Liechtensteiner",
            "Lithuanian",
            "Luxembourger",
            "Macedonian",
            "Malagasy",
            "Malawian",
            "Malaysian",
            "Maldivan",
            "Malian",
            "Maltese",
            "Marshallese",
            "Mauritanian",
            "Mauritian",
            "Mexican",
            "Micronesian",
            "Moldovan",
            "Monacan",
            "Mongolian",
            "Moroccan",
            "Mosotho",
            "Motswana",
            "Mozambican",
            "Namibian",
            "Nauruan",
            "Nepalese",
            "New Zealander",
            "Nicaraguan",
            "Nigerian",
            "Nigerien",
            "North Korean",
            "Northern Irish",
            "Norwegian",
            "Omani",
            "Pakistani",
            "Palauan",
            "Panamanian",
            "Papua New Guinean",
            "Paraguayan",
            "Peruvian",
            "Polish",
            "Portuguese",
            "Qatari",
            "Romanian",
            "Russian",
            "Rwandan",
            "Saint Lucian",
            "Salvadoran",
            "Samoan",
            "San Marinese",
            "Sao Tomean",
            "Saudi",
            "Scottish",
            "Senegalese",
            "Serbian",
            "Seychellois",
            "Sierra Leonean",
            "Singaporean",
            "Slovakian",
            "Slovenian",
            "Solomon Islander",
            "Somali",
            "South African",
            "South Korean",
            "Spanish",
            "Sri Lankan",
            "Sudanese",
            "Surinamer",
            "Swazi",
            "Swedish",
            "Swiss",
            "Syrian",
            "Taiwanese",
            "Tajik",
            "Tanzanian",
            "Thai",
            "Togolese",
            "Tongan",
            "Trinidadian or Tobagonian",
            "Tunisian",
            "Turkish",
            "Tuvaluan",
            "Ugandan",
            "Ukrainian",
            "Uruguayan",
            "Uzbekistani",
            "Venezuelan",
            "Vietnamese",
            "Welsh",
            "Yemenite",
            "Zambian",
            "Zimbabwean"
        ],
        countries: [{
                name: 'Afghanistan',
                code: 'AF'
            },
            {
                name: 'Åland Islands',
                code: 'AX'
            },
            {
                name: 'Albania',
                code: 'AL'
            },
            {
                name: 'Algeria',
                code: 'DZ'
            },
            {
                name: 'American Samoa',
                code: 'AS'
            },
            {
                name: 'AndorrA',
                code: 'AD'
            },
            {
                name: 'Angola',
                code: 'AO'
            },
            {
                name: 'Anguilla',
                code: 'AI'
            },
            {
                name: 'Antarctica',
                code: 'AQ'
            },
            {
                name: 'Antigua and Barbuda',
                code: 'AG'
            },
            {
                name: 'Argentina',
                code: 'AR'
            },
            {
                name: 'Armenia',
                code: 'AM'
            },
            {
                name: 'Aruba',
                code: 'AW'
            },
            {
                name: 'Australia',
                code: 'AU'
            },
            {
                name: 'Austria',
                code: 'AT'
            },
            {
                name: 'Azerbaijan',
                code: 'AZ'
            },
            {
                name: 'Bahamas',
                code: 'BS'
            },
            {
                name: 'Bahrain',
                code: 'BH'
            },
            {
                name: 'Bangladesh',
                code: 'BD'
            },
            {
                name: 'Barbados',
                code: 'BB'
            },
            {
                name: 'Belarus',
                code: 'BY'
            },
            {
                name: 'Belgium',
                code: 'BE'
            },
            {
                name: 'Belize',
                code: 'BZ'
            },
            {
                name: 'Benin',
                code: 'BJ'
            },
            {
                name: 'Bermuda',
                code: 'BM'
            },
            {
                name: 'Bhutan',
                code: 'BT'
            },
            {
                name: 'Bolivia',
                code: 'BO'
            },
            {
                name: 'Bosnia and Herzegovina',
                code: 'BA'
            },
            {
                name: 'Botswana',
                code: 'BW'
            },
            {
                name: 'Bouvet Island',
                code: 'BV'
            },
            {
                name: 'Brazil',
                code: 'BR'
            },
            {
                name: 'British Indian Ocean Territory',
                code: 'IO'
            },
            {
                name: 'Brunei Darussalam',
                code: 'BN'
            },
            {
                name: 'Bulgaria',
                code: 'BG'
            },
            {
                name: 'Burkina Faso',
                code: 'BF'
            },
            {
                name: 'Burundi',
                code: 'BI'
            },
            {
                name: 'Cambodia',
                code: 'KH'
            },
            {
                name: 'Cameroon',
                code: 'CM'
            },
            {
                name: 'Canada',
                code: 'CA'
            },
            {
                name: 'Cape Verde',
                code: 'CV'
            },
            {
                name: 'Cayman Islands',
                code: 'KY'
            },
            {
                name: 'Central African Republic',
                code: 'CF'
            },
            {
                name: 'Chad',
                code: 'TD'
            },
            {
                name: 'Chile',
                code: 'CL'
            },
            {
                name: 'China',
                code: 'CN'
            },
            {
                name: 'Christmas Island',
                code: 'CX'
            },
            {
                name: 'Cocos (Keeling) Islands',
                code: 'CC'
            },
            {
                name: 'Colombia',
                code: 'CO'
            },
            {
                name: 'Comoros',
                code: 'KM'
            },
            {
                name: 'Congo',
                code: 'CG'
            },
            {
                name: 'Congo, The Democratic Republic of the',
                code: 'CD'
            },
            {
                name: 'Cook Islands',
                code: 'CK'
            },
            {
                name: 'Costa Rica',
                code: 'CR'
            },
            {
                name: 'Cote D\'Ivoire',
                code: 'CI'
            },
            {
                name: 'Croatia',
                code: 'HR'
            },
            {
                name: 'Cuba',
                code: 'CU'
            },
            {
                name: 'Cyprus',
                code: 'CY'
            },
            {
                name: 'Czech Republic',
                code: 'CZ'
            },
            {
                name: 'Denmark',
                code: 'DK'
            },
            {
                name: 'Djibouti',
                code: 'DJ'
            },
            {
                name: 'Dominica',
                code: 'DM'
            },
            {
                name: 'Dominican Republic',
                code: 'DO'
            },
            {
                name: 'Ecuador',
                code: 'EC'
            },
            {
                name: 'Egypt',
                code: 'EG'
            },
            {
                name: 'El Salvador',
                code: 'SV'
            },
            {
                name: 'Equatorial Guinea',
                code: 'GQ'
            },
            {
                name: 'Eritrea',
                code: 'ER'
            },
            {
                name: 'Estonia',
                code: 'EE'
            },
            {
                name: 'Ethiopia',
                code: 'ET'
            },
            {
                name: 'Falkland Islands (Malvinas)',
                code: 'FK'
            },
            {
                name: 'Faroe Islands',
                code: 'FO'
            },
            {
                name: 'Fiji',
                code: 'FJ'
            },
            {
                name: 'Finland',
                code: 'FI'
            },
            {
                name: 'France',
                code: 'FR'
            },
            {
                name: 'French Guiana',
                code: 'GF'
            },
            {
                name: 'French Polynesia',
                code: 'PF'
            },
            {
                name: 'French Southern Territories',
                code: 'TF'
            },
            {
                name: 'Gabon',
                code: 'GA'
            },
            {
                name: 'Gambia',
                code: 'GM'
            },
            {
                name: 'Georgia',
                code: 'GE'
            },
            {
                name: 'Germany',
                code: 'DE'
            },
            {
                name: 'Ghana',
                code: 'GH'
            },
            {
                name: 'Gibraltar',
                code: 'GI'
            },
            {
                name: 'Greece',
                code: 'GR'
            },
            {
                name: 'Greenland',
                code: 'GL'
            },
            {
                name: 'Grenada',
                code: 'GD'
            },
            {
                name: 'Guadeloupe',
                code: 'GP'
            },
            {
                name: 'Guam',
                code: 'GU'
            },
            {
                name: 'Guatemala',
                code: 'GT'
            },
            {
                name: 'Guernsey',
                code: 'GG'
            },
            {
                name: 'Guinea',
                code: 'GN'
            },
            {
                name: 'Guinea-Bissau',
                code: 'GW'
            },
            {
                name: 'Guyana',
                code: 'GY'
            },
            {
                name: 'Haiti',
                code: 'HT'
            },
            {
                name: 'Heard Island and Mcdonald Islands',
                code: 'HM'
            },
            {
                name: 'Holy See (Vatican City State)',
                code: 'VA'
            },
            {
                name: 'Honduras',
                code: 'HN'
            },
            {
                name: 'Hong Kong',
                code: 'HK'
            },
            {
                name: 'Hungary',
                code: 'HU'
            },
            {
                name: 'Iceland',
                code: 'IS'
            },
            {
                name: 'India',
                code: 'IN'
            },
            {
                name: 'Indonesia',
                code: 'ID'
            },
            {
                name: 'Iran, Islamic Republic Of',
                code: 'IR'
            },
            {
                name: 'Iraq',
                code: 'IQ'
            },
            {
                name: 'Ireland',
                code: 'IE'
            },
            {
                name: 'Isle of Man',
                code: 'IM'
            },
            {
                name: 'Israel',
                code: 'IL'
            },
            {
                name: 'Italy',
                code: 'IT'
            },
            {
                name: 'Jamaica',
                code: 'JM'
            },
            {
                name: 'Japan',
                code: 'JP'
            },
            {
                name: 'Jersey',
                code: 'JE'
            },
            {
                name: 'Jordan',
                code: 'JO'
            },
            {
                name: 'Kazakhstan',
                code: 'KZ'
            },
            {
                name: 'Kenya',
                code: 'KE'
            },
            {
                name: 'Kiribati',
                code: 'KI'
            },
            {
                name: 'Korea, Democratic People\'S Republic of',
                code: 'KP'
            },
            {
                name: 'Korea, Republic of',
                code: 'KR'
            },
            {
                name: 'Kuwait',
                code: 'KW'
            },
            {
                name: 'Kyrgyzstan',
                code: 'KG'
            },
            {
                name: 'Lao People\'S Democratic Republic',
                code: 'LA'
            },
            {
                name: 'Latvia',
                code: 'LV'
            },
            {
                name: 'Lebanon',
                code: 'LB'
            },
            {
                name: 'Lesotho',
                code: 'LS'
            },
            {
                name: 'Liberia',
                code: 'LR'
            },
            {
                name: 'Libyan Arab Jamahiriya',
                code: 'LY'
            },
            {
                name: 'Liechtenstein',
                code: 'LI'
            },
            {
                name: 'Lithuania',
                code: 'LT'
            },
            {
                name: 'Luxembourg',
                code: 'LU'
            },
            {
                name: 'Macao',
                code: 'MO'
            },
            {
                name: 'Macedonia, The Former Yugoslav Republic of',
                code: 'MK'
            },
            {
                name: 'Madagascar',
                code: 'MG'
            },
            {
                name: 'Malawi',
                code: 'MW'
            },
            {
                name: 'Malaysia',
                code: 'MY'
            },
            {
                name: 'Maldives',
                code: 'MV'
            },
            {
                name: 'Mali',
                code: 'ML'
            },
            {
                name: 'Malta',
                code: 'MT'
            },
            {
                name: 'Marshall Islands',
                code: 'MH'
            },
            {
                name: 'Martinique',
                code: 'MQ'
            },
            {
                name: 'Mauritania',
                code: 'MR'
            },
            {
                name: 'Mauritius',
                code: 'MU'
            },
            {
                name: 'Mayotte',
                code: 'YT'
            },
            {
                name: 'Mexico',
                code: 'MX'
            },
            {
                name: 'Micronesia, Federated States of',
                code: 'FM'
            },
            {
                name: 'Moldova, Republic of',
                code: 'MD'
            },
            {
                name: 'Monaco',
                code: 'MC'
            },
            {
                name: 'Mongolia',
                code: 'MN'
            },
            {
                name: 'Montserrat',
                code: 'MS'
            },
            {
                name: 'Morocco',
                code: 'MA'
            },
            {
                name: 'Mozambique',
                code: 'MZ'
            },
            {
                name: 'Myanmar',
                code: 'MM'
            },
            {
                name: 'Namibia',
                code: 'NA'
            },
            {
                name: 'Nauru',
                code: 'NR'
            },
            {
                name: 'Nepal',
                code: 'NP'
            },
            {
                name: 'Netherlands',
                code: 'NL'
            },
            {
                name: 'Netherlands Antilles',
                code: 'AN'
            },
            {
                name: 'New Caledonia',
                code: 'NC'
            },
            {
                name: 'New Zealand',
                code: 'NZ'
            },
            {
                name: 'Nicaragua',
                code: 'NI'
            },
            {
                name: 'Niger',
                code: 'NE'
            },
            {
                name: 'Nigeria',
                code: 'NG'
            },
            {
                name: 'Niue',
                code: 'NU'
            },
            {
                name: 'Norfolk Island',
                code: 'NF'
            },
            {
                name: 'Northern Mariana Islands',
                code: 'MP'
            },
            {
                name: 'Norway',
                code: 'NO'
            },
            {
                name: 'Oman',
                code: 'OM'
            },
            {
                name: 'Pakistan',
                code: 'PK'
            },
            {
                name: 'Palau',
                code: 'PW'
            },
            {
                name: 'Palestinian Territory, Occupied',
                code: 'PS'
            },
            {
                name: 'Panama',
                code: 'PA'
            },
            {
                name: 'Papua New Guinea',
                code: 'PG'
            },
            {
                name: 'Paraguay',
                code: 'PY'
            },
            {
                name: 'Peru',
                code: 'PE'
            },
            {
                name: 'Philippines',
                code: 'PH'
            },
            {
                name: 'Pitcairn',
                code: 'PN'
            },
            {
                name: 'Poland',
                code: 'PL'
            },
            {
                name: 'Portugal',
                code: 'PT'
            },
            {
                name: 'Puerto Rico',
                code: 'PR'
            },
            {
                name: 'Qatar',
                code: 'QA'
            },
            {
                name: 'Reunion',
                code: 'RE'
            },
            {
                name: 'Romania',
                code: 'RO'
            },
            {
                name: 'Russian Federation',
                code: 'RU'
            },
            {
                name: 'RWANDA',
                code: 'RW'
            },
            {
                name: 'Saint Helena',
                code: 'SH'
            },
            {
                name: 'Saint Kitts and Nevis',
                code: 'KN'
            },
            {
                name: 'Saint Lucia',
                code: 'LC'
            },
            {
                name: 'Saint Pierre and Miquelon',
                code: 'PM'
            },
            {
                name: 'Saint Vincent and the Grenadines',
                code: 'VC'
            },
            {
                name: 'Samoa',
                code: 'WS'
            },
            {
                name: 'San Marino',
                code: 'SM'
            },
            {
                name: 'Sao Tome and Principe',
                code: 'ST'
            },
            {
                name: 'Saudi Arabia',
                code: 'SA'
            },
            {
                name: 'Senegal',
                code: 'SN'
            },
            {
                name: 'Serbia and Montenegro',
                code: 'CS'
            },
            {
                name: 'Seychelles',
                code: 'SC'
            },
            {
                name: 'Sierra Leone',
                code: 'SL'
            },
            {
                name: 'Singapore',
                code: 'SG'
            },
            {
                name: 'Slovakia',
                code: 'SK'
            },
            {
                name: 'Slovenia',
                code: 'SI'
            },
            {
                name: 'Solomon Islands',
                code: 'SB'
            },
            {
                name: 'Somalia',
                code: 'SO'
            },
            {
                name: 'South Africa',
                code: 'ZA'
            },
            {
                name: 'South Georgia and the South Sandwich Islands',
                code: 'GS'
            },
            {
                name: 'Spain',
                code: 'ES'
            },
            {
                name: 'Sri Lanka',
                code: 'LK'
            },
            {
                name: 'Sudan',
                code: 'SD'
            },
            {
                name: 'Suriname',
                code: 'SR'
            },
            {
                name: 'Svalbard and Jan Mayen',
                code: 'SJ'
            },
            {
                name: 'Swaziland',
                code: 'SZ'
            },
            {
                name: 'Sweden',
                code: 'SE'
            },
            {
                name: 'Switzerland',
                code: 'CH'
            },
            {
                name: 'Syrian Arab Republic',
                code: 'SY'
            },
            {
                name: 'Taiwan, Province of China',
                code: 'TW'
            },
            {
                name: 'Tajikistan',
                code: 'TJ'
            },
            {
                name: 'Tanzania, United Republic of',
                code: 'TZ'
            },
            {
                name: 'Thailand',
                code: 'TH'
            },
            {
                name: 'Timor-Leste',
                code: 'TL'
            },
            {
                name: 'Togo',
                code: 'TG'
            },
            {
                name: 'Tokelau',
                code: 'TK'
            },
            {
                name: 'Tonga',
                code: 'TO'
            },
            {
                name: 'Trinidad and Tobago',
                code: 'TT'
            },
            {
                name: 'Tunisia',
                code: 'TN'
            },
            {
                name: 'Turkey',
                code: 'TR'
            },
            {
                name: 'Turkmenistan',
                code: 'TM'
            },
            {
                name: 'Turks and Caicos Islands',
                code: 'TC'
            },
            {
                name: 'Tuvalu',
                code: 'TV'
            },
            {
                name: 'Uganda',
                code: 'UG'
            },
            {
                name: 'Ukraine',
                code: 'UA'
            },
            {
                name: 'United Arab Emirates',
                code: 'AE'
            },
            {
                name: 'United Kingdom',
                code: 'GB'
            },
            {
                name: 'United States',
                code: 'US'
            },
            {
                name: 'United States Minor Outlying Islands',
                code: 'UM'
            },
            {
                name: 'Uruguay',
                code: 'UY'
            },
            {
                name: 'Uzbekistan',
                code: 'UZ'
            },
            {
                name: 'Vanuatu',
                code: 'VU'
            },
            {
                name: 'Venezuela',
                code: 'VE'
            },
            {
                name: 'Viet Nam',
                code: 'VN'
            },
            {
                name: 'Virgin Islands, British',
                code: 'VG'
            },
            {
                name: 'Virgin Islands, U.S.',
                code: 'VI'
            },
            {
                name: 'Wallis and Futuna',
                code: 'WF'
            },
            {
                name: 'Western Sahara',
                code: 'EH'
            },
            {
                name: 'Yemen',
                code: 'YE'
            },
            {
                name: 'Zambia',
                code: 'ZM'
            },
            {
                name: 'Zimbabwe',
                code: 'ZW'
            }
        ]

    },
    getters: {
        getCurrentUser: (state)=>{
            return state.currentUser
        },
        isAuth: (state) => {
            return state.isAuth
        },
             getLastLoggedIn: (state)=>{
            return state.lastloggedin
        },
        getCountries: (state) => {
            return state.countries
        },
        getBookings: (state) => {
            return state.bookings
        },
        getPartners: (state) => {
            return state.partners
        },
        getServices: (state) => {
            return state.services
        },
        getAreas: (state) => {
            return state.areas
        },
        getSearchData: (state) => {
            return state.search
        },
        contactSheet: (state) => {
            return state.contactSheet
        },
        cartSize: (state) => {
            return state.cart.length
        },
        getCurrencies: (state) => {
            return state.exchange
        },
        getCurrency: (state) => {
            return state.currency
        },
        cardMode: (state) => {
            return state.mode
        },
        getNationality: (state) => {
            return state.nationality
        },
        getCart: (state) => {
            return state.cart
        },
        getRevCount: (state) => {
            return state.revCount

        },
        getCartID: (state) => {
            return state.cartID
        },
       
        getCurrentSearch: (state) => {
            return state.search
        },
        getWishList: (state) => {
            return state.wishlist
        },
        getTransResult: (state) => {
            return state.trans_result
        },
        getTourResult: (state) => {
            return state.tour_result
        },
        getIfReady: (state) => {
            return state.tour_result.length > 0
        },
        getCartTotal: (state) => {
            var total = 0;
            state.cart.forEach(function(data) {
                var baseprice = data.pax < data.rateinfo.ceil ? parseFloat((data.rateinfo.base)) : (parseFloat(data.rateinfo.base) + ((parseInt(data.pax) - parseInt(data.rateinfo.ceil)) * parseFloat(data.rateinfo.price)))
                var price = parseFloat(baseprice + data.rates.extra.dropoff.rate + data.rates.extra.pickup.rate)
                total = parseFloat(total) + price
            })

            return total
        },
        getCurrentTransDetails: (state) => {
            return state.trans_details
        },
    },
    mutations: {
        fetchServices: function(state,data){
            state.services = data
        },
        setCurrentUser: function(state,data){
            state.currentUser = data
        },
        setAuth: function(state, data) {
            state.isAuth = data
        },
        updatePartners: function(state, data) {
            state.partners = data
        },
        setBookings: function(state, data) {
            state.bookings = data
        },
        setCurrency: function(state, data) {
            state.currency = data
        },
        setMode: function(state, data) {
            state.mode = data
        },
        setExchangeRate: function(state, data) {
            state.exchange = data
        },
        addToCart: function(state, data) {
            state.cart.push(data)

        },
        emptyCart: function(state) {
            state.cart = []

        },

        removeCartItem: function(state, data) {
            for (var i = 0; i < state.cart.length; i++) {
                if (state.cart[i] === data)
                    state.cart.splice(i, 1)

            }


        },
        updateCartItem: function(state, data) {

            var index = state.cart.indexOf(data.oldData);

            state.cart.splice(index, 1, data.newData)




        },
        addToWishList: function(state, data) {

            if (state.wishlist.indexOf(data) < 0)
                state.wishlist.push(data)
            else
                state.wishlist.splice(state.wishlist.indexOf(data), 1)

        },

        updateSearch: function(state, data) {
            state.search = Object.assign({}, data)

        },

        updateTransResult: function(state, data) {
            state.trans_result = data

        },
        updateTourResult: function(state, data) {
            state.tour_result = data

        },
        updateCurrentUser: function(state, data) {
            state.currentUser = Object.assign({}, data)

        },
        updateRevCount: function(state, data) {
            state.revCount = Object.assign({}, data)

        },

        updateCurrentTrans: function(state, data) {
            state.trans_details = Object.assign({}, data)

        },
        updateContactSheet: function(state, data) {
            state.contactSheet = data
        },
        generateCartID: function(state, data) {
            state.cartID = data
        }
    },
    actions: {
        fetchServices: function(context,data){
            context.commit('fetchServices',data)
        },
        setCurrentUser: function(context, data){
            context.commit('setCurrentUser',data)
        },
        setBookings: function(context, data) {
            context.commit('setBookings', data)
        },
        updatePartners: function(context, data) {
            context.commit('updatePartners', data)
        },
        generateCartID: function(context, data) {
            context.commit('generateCardID', data)
        },
        addToCart: function(context, data) {
            context.commit('addToCart', data)
        },
        emptyCart: function(context) {
            context.commit('emptyCart')
        },

        addToWishList: function(context, data) {
            context.commit('addToWishList', data)

        },
        setCurrency: function(context, data) {
            context.commit('setCurrency', data)
        },
        setMode: function(context, data) {
            context.commit('setMode', data)
        },
        setExchangeRate: function(context, data) {
            context.commit('setExchangeRate', data)
        },
        removeCartItem: function(context, data) {

            context.commit('removeCartItem', data)
        },
        updateCartItem: function(context, data) {
            context.commit('updateCartItem', data)
        },
        updateSearch: function(context, data) {
            context.commit('updateSearch', data)
        },
        updateTransResult: function(context, data) {
            context.commit('updateTransResult', data)
        },
        updateTourResult: function(context, data) {
            context.commit('updateTourResult', data)
        },
        updateCurrentUser: function(context, data) {
            context.commit('updateCurrentUser', data)
        },
        updateContactSheet: function(context, data) {
            context.commit('updateContactSheet', data)
        },
        updateCurrentTrans: function(context, data) {
            context.commit('updateCurrentTrans', data)
        }
    }
})
export default store