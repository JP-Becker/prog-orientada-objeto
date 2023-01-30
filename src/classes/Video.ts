export class Video {
    
    constructor (
        private id: string,
        private title: string,
        private videoLength: number,
        private uploadedAt: string
    ) {}

    public getId(): string {
        return this.id
    }
    public setId(value: string) {
        this.id = value
    }

    public getTitle(): string {
        return this.title
    }
    public setTitle(value: string): void {
        this.title = value
    }

    public getVideoLength(): number {
        return this.videoLength
    }
    public setVideoLength(value: number): void {
        this.videoLength = value
    }

    public getUploadedAt(): string {
        return this.uploadedAt
    }
    public setUploadedAt(value: string): void {
        this.uploadedAt = value
    }
}