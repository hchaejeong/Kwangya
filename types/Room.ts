//룸 생성할때 필요한 기본 정보들
export interface IRoomData {
    name: string
    description: string
    password: string | null
    autoDispose: boolean
}