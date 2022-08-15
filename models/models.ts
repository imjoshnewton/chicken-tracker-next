export interface Flock {
    id: string,
    name: string,
    description: string,
    type: 'egg-layers' | 'meat-birds',
    imageUrl: string,
    owner: string,
    default: boolean,
    breeds: {
        name: string,
        averageProduction: number,
        count: number,
        imageUrl?: string,
    }[]
}

export interface Log {
    id: string,
    date: Date, 
    count: number, 
    notes: string,
    flock: string,
}

export interface Expense {
    id: string,
    date: Date, 
    amount: number, 
    memo: string,
    flock: string,
}