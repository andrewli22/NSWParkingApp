export type RootStackParamList = {
  HomeDrawer: undefined,
  Carpark: { facilityId: string, facilityName: string };
}
export interface SectionDataType {
  title: string,
  data: CarParkDataType[]
}

export interface CarParkDataType {
  id: string,
  name: string
}