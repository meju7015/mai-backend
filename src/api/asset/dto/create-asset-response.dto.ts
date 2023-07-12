import { BaseResponse } from '../../../base/BaseResponse';

interface ICreateAssetResponse {
  id: number;
  uuid: string;
  name: string;
  contentType: string;
  createdAt: Date;
}

export class CreateAssetResponseDto extends BaseResponse<ICreateAssetResponse> {
  data: ICreateAssetResponse;

  constructor(status: number, data: ICreateAssetResponse) {
    super(status);
    this.data = data;
  }
}
