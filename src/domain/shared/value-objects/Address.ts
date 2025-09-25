

export type State = 'NY' | 'NJ' | 'CT' | 'PA' | 'MA' | 'RI' | 'NH' | 'VT' | 'ME' | 'DE' | 'MD' | 'DC' | 'VA' | 'NC' | 'SC' | 'GA' | 'FL' | 'AL' | 'MS' | 'AR' | 'LA' | 'TX' | 'OK' | 'KS' | 'NE' | 'SD' | 'ND' | 'MT' | 'WY' | 'CO' | 'NM' | 'AZ' | 'CA' | 'HI' | 'AK';

export class Address {
    constructor(
        private readonly street: string,
        private readonly city: string,
        private readonly state: State,
        private readonly zip: string
    ) {}

    static create(street: string, city: string, state: State, zip: string): Address {
        if (!street) {
            throw new Error('Street is required');
        }
        if (!city) {
            throw new Error('City is required');
        }
        if (!state) {
            throw new Error('State is required');
        }
        if (!zip) {
            throw new Error('Zip is required');
        }
        return new Address(street, city, state, zip);
    }

    getStreet(): string {
        return this.street;
    }

    getCity(): string {
        return this.city;
    }
    
    getState(): State {
        return this.state;
    }

    getZip(): string {
        return this.zip;
    }

    equals(other: Address): boolean {
        return this.street === other.street && this.city === other.city && this.state === other.state && this.zip === other.zip;
    }
}
