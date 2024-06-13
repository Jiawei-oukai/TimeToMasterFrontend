export default interface Achievement {
    _id : string;
    userId:string;
    goalId: string;
    description: string;
    achieved: boolean;
    imagePath: string;
    achievementDate: string;
};