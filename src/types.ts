// Define common types used throughout the application
export type Letter = string | null;

export enum LetterStatus {
    CORRECT = 'existsInPosition',
    DIFF_POS = 'existsInWord',
    ABSENT = 'notInWord',
    // UNKNOWN = 'notGuessed'
}
export const letterStatusColorMap: Record<LetterStatus, string | undefined> = {
    [LetterStatus.CORRECT]: 'green',
    [LetterStatus.DIFF_POS]: 'yellow',
    [LetterStatus.ABSENT]: 'gray',
    // [LetterStatus.UNKNOWN]: undefined,
}
