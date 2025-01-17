"use client";
import {useEffect, useState} from "react";
import {Button, Card, Divider, Segmented, Select, Slider, Typography,} from "antd";
import {IoMdGlobe} from "react-icons/io";
import {MdOutlineHotel, MdOutlineVilla} from "react-icons/md";
import {toMoneyFormat} from "@/lib/utils";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {selectExchangeRate, selectGlobalCurrency} from "@/slices/staysSlice";
import LocationFilterComponent, {LocationFilter,} from "@/components/search/locationFilter";
import RoomAndBedsFilter from "@/components/search/roomAndBedsFilter";
import {
  fetchFilteredStays,
  fetchFilteredStaysCount,
  resetFilters,
  setDisplayList,
  setPartiesFilter,
  setPetsFilter,
  setPriceRangeFilter,
  setSmokingFilter,
  setTypeFilter,
  updatePreFilter
} from "@/slices/searchSlice";
import {Home, Hotel, Room} from "@/lib/types";

const { Title } = Typography;

export default function SearchFilter({
  stays,
  onFilter,
}: {
  stays: any[];
  onFilter: any;
}) {
  const dispatch = useAppDispatch();
  const globalCurrency = useAppSelector(selectGlobalCurrency);
  const exchangeRates = useAppSelector(selectExchangeRate);
  // const [displayStays, setDisplayStays] = useState<any[]>([]);
  const {displayList,typeFilter,priceRange,amenityFilters,locationFilter,roomAndBedFilter,smokingFilter,petsFilter,partiesFilter,collectedProperties} = useAppSelector(state => state.search);
  const collected = collectedProperties;
  const [highestPrice, setHighestPrice] = useState(200);
  const [lowestPrice, setLowestPrice] = useState(0);

  const { isCountLoading, availableCount } = useAppSelector(
    (state) => state.search
  );


  // const [availableFilters, setAvailableFilters] = useState<{
  //   amenities: string[];
  //   locations: string[];
  // }>({ amenities: [], locations: [] });



  function calculatePrice(price: number) {
    let convertedPrice = (price * 1.02) / exchangeRates["USD"];
    return toMoneyFormat(convertedPrice);
  }

  useEffect(() => {

    const prices: number[] = collectedProperties && collectedProperties.price? collectedProperties.price as number[] :[];

    if (prices && prices.length > 0) {
      prices.sort((a, b) => a - b);
      const low = prices[0];
      const high = prices[prices.length - 1];
      setHighestPrice(high);
      setLowestPrice(low);
      dispatch(setPriceRangeFilter([low, high]))
    }
    // function generateFilters() {
    //   const amenitiesSet = new Set<string>();
    //   const locationsSet = new Set<string>();
    //   stays.forEach((stay) => {
    //     stay.rooms.forEach((room: any) => {
    //       room.amenities.forEach((amenity: string) => {
    //         amenitiesSet.add(amenity);
    //       });
    //     });
    //     stay.facilities.forEach((facility: string) => {
    //       amenitiesSet.add(facility);
    //     });
    //     locationsSet.add(stay.location.city); // Assuming stays have a location field
    //   });
    //   return {
    //     amenities: Array.from(amenitiesSet),
    //     locations: Array.from(locationsSet),
    //   };
    // }
    // setAvailableFilters(generateFilters());
  }, [collectedProperties, dispatch]);




  function applyFilters() {
    let filteredStays = stays;

    // Filter by type
    if (typeFilter !== "All") {
      filteredStays = filteredStays.filter((stay) => stay.type === typeFilter);
    }

    if (priceRange){
      // Filter by price
      filteredStays = filteredStays.filter((stay) => {
        if (stay.type === "Hotel") {
          return stay.rooms.some(
              (room: any) =>
                  room.price >= priceRange[0] && room.price <= priceRange[1]
          );
        } else {
          return stay.price >= priceRange[0] && stay.price <= priceRange[1];
        }
      });

    }
    // Filter by amenities
    if (amenityFilters.length > 0) {
      filteredStays = filteredStays.filter((stay) => {
        return stay.rooms.some((room: any) => {
          return amenityFilters.every((amenity) =>
            room.amenities.includes(amenity)
          );
        });
      });
    }
    if (locationFilter) {
        filteredStays = filteredStays.filter((stay) => {
          const location = stay.location;
          return (
            !locationFilter ||
            Object.keys(locationFilter).every((key) => {
              const filterValue = locationFilter[key as keyof LocationFilter];
              return filterValue ? filterValue === location[key] : true;
            })
          );
        });
      }

      dispatch(fetchFilteredStays()).then((value) => {
          if (value.meta.requestStatus === 'rejected') {
            dispatch(setDisplayList(filteredStays))
          }
      })
    // setDisplayStays(filteredStays);
    onFilter(filteredStays);
  }

  function previewFilters() {

    let filteredStays = [...stays];

    // Filter by type
    if (typeFilter !== "All") {
      filteredStays = filteredStays.filter((stay) => stay.type === typeFilter);
    }

    if (priceRange) {
      // Filter by price
      filteredStays = filteredStays.filter((stay) => {
        if (stay.type === "Hotel") {
          return stay.rooms.some(
              (room: any) =>
                  room.price >= priceRange[0] && room.price <= priceRange[1]
          );
        } else {
          return stay.price >= priceRange[0] && stay.price <= priceRange[1];
        }
      });
    }

    // Filter by amenities
    if (amenityFilters.length > 0) {
      filteredStays = filteredStays.filter((stay) => {
        return stay.rooms.some((room: any) => {
          return amenityFilters.every((amenity) =>
            room.amenities.includes(amenity)
          );
        });
      });
    }
    if (locationFilter) {
      filteredStays = filteredStays.filter((stay) => {
        const location = stay.location;
        return (
          !locationFilter ||
          Object.keys(locationFilter).every((key) => {
            const filterValue = locationFilter[key as keyof LocationFilter];
            return filterValue ? filterValue === location[key] : true;
          })
        );
      });
    }

    if (roomAndBedFilter) {
        const {bedrooms, beds, bathrooms} = roomAndBedFilter;
        filteredStays = filteredStays.filter((stay) => {
                if (stay.type === "Home") {
                  return (
                    (stay as Home).bedrooms >= bedrooms &&
                    (stay as Home).beds >= beds &&
                    (stay as Home).bathrooms >= bathrooms
                  );
                } else if (stay.type === "Hotel") {
                  return (stay as Hotel).rooms.some((room) =>
                    room.beds.some((bed) => bed.number >= beds)
                  );
                }
                return false;
              });
    }

    return filteredStays.length;
  }

  useEffect(() => {
    dispatch(
        fetchFilteredStaysCount()
      );
  }, [typeFilter, priceRange, amenityFilters, locationFilter, dispatch])

  const totalCount = () => {
    const localCount = previewFilters();
    if (localCount > availableCount) {
      return localCount;
    } else {
      return availableCount;
    }
  };

  return (
    <div>
      <Card
        className={"space-y-2"}
        classNames={{
          body: "space-y-4",
        }}
      >
        <div className={"flex gap-2"}>
          <Button
            onClick={() => {
              dispatch(resetFilters());
              dispatch(setDisplayList(stays));
              dispatch(updatePreFilter(stays))
            }}
          >
            Reset
          </Button>
          <Button
            loading={isCountLoading}
            type={"primary"}
            onClick={applyFilters}
          >
            {`(${totalCount()}) Apply`}
          </Button>
        </div>
        <div>
          <Title level={5}>Type</Title>
          <Segmented
            options={[
              {
                icon: <IoMdGlobe />,
                label: "All",
                value: "All",
              },
              {
                icon: <MdOutlineHotel />,
                label: "Hotels",
                value: "Hotel",
              },
              {
                icon: <MdOutlineVilla />,
                label: "Homes",
                value: "Home",
              },
            ]}
            value={typeFilter}
            onChange={(value) => dispatch(setTypeFilter(value))}
            size={"large"}
            block={true}
          />
        </div>
        <Divider type={"horizontal"} />
        {typeFilter === "Home" && collected && collected.homeType && (
          <div>
            <Title level={5}>Home Type</Title>
            <Select
              className={"w-full"}
              size={"large"}
              placeholder={"Home type"}
              options={[
                {
                  value: undefined,
                  label: "Any Type",
                },
                ...collected.homeType.map((value:string) => ({
                  value: value,
                  label: value,
                })),
              ]}
            />
          </div>
        )}
        <div>
          <div className={"flex justify-between"}>
            <h3>Price</h3>
            <span className={" text-primary"}>
              {globalCurrency} {calculatePrice(lowestPrice)} - {globalCurrency}{" "}
              {calculatePrice(highestPrice)}
            </span>
          </div>
          <Slider
              range
              min={lowestPrice}
              max={highestPrice}
              value={priceRange}
              tooltip={{
                formatter: (value) =>
                    value !== undefined ? calculatePrice(value) : "",
              }}
              onChange={(values) => {
                console.log("Raw USD values:", values);
                return dispatch(setPriceRangeFilter(values));
              }}

          />
        </div>

        <LocationFilterComponent
          stays={stays}
        />
        <Divider type={"horizontal"} />
        <RoomAndBedsFilter
          collectedProperties={collected}

        />
        <Divider type={"horizontal"} />
        {collected && collected.parties && (
          <div>
            <Title level={5}>Parties</Title>
            <Select
              className={"w-full"}
              placeholder={"Parties"}
              value={partiesFilter}
              options={[
                {
                  value: undefined,
                  label: "Any",
                },
                ...collected.parties
                  .map((value:any) => ({ value: value, label: value }))
                  .reverse(),
              ]}
              onChange={(value) => {
               dispatch(setPartiesFilter(value));
              }}
            />
          </div>
        )}

        {collected && collected.smoking && (
          <div>
            <Title level={5}>Smoking</Title>
            <Select
              className={"w-full"}
              placeholder={"Smoking"}
              value={smokingFilter}
              options={[
                {
                  value: undefined,
                  label: "Any",
                },
                ...collected.smoking
                  .map((value:any) => ({ value: value, label: value }))
                  .reverse(),
              ]}
              onChange={(value) => {
               dispatch(setSmokingFilter(value));
              }}
            />
          </div>
        )}
        {collected && collected.pets && (
          <div>
            <Title level={5}>Pets Allowed</Title>
            <Select
              className={"w-full"}
              placeholder={"Pets"}
              value={petsFilter}
              options={[
                {
                  value: undefined,
                  label: "Any",
                },
                ...collected.pets
                  .map((value:any) => ({ value: value, label: value }))
                  .reverse(),
              ]}
              onChange={(value) => {
                dispatch(setPetsFilter(value));
              }}
            />
          </div>
        )}
        {/*{typeFilter === "Hotel" && (*/}
        {/*  <div className={""}>*/}
        {/*    <Title level={5}>Hotel Amenities</Title>*/}
        {/*    <Collapse*/}
        {/*      ghost*/}
        {/*      items={hotelFacilities*/}
        {/*        .map((value: any, index) => {*/}
        {/*          let name: string = Object.keys(value)[0];*/}
        {/*          return {*/}
        {/*            key: index,*/}
        {/*            label: name,*/}
        {/*            children: value[name]*/}
        {/*              .filter((value: string) =>*/}
        {/*                availableFilters.amenities.includes(value)*/}
        {/*              )*/}
        {/*              .map((amenity: string, index: number) => (*/}
        {/*                <Checkbox*/}
        {/*                  key={index}*/}
        {/*                  className={"flex"}*/}
        {/*                  checked={amenityFilters.includes(amenity)}*/}
        {/*                  onChange={(e) => {*/}
        {/*                    if (e.target.checked) {*/}
        {/*                      dispatch(setAmenityFilters([...amenityFilters, amenity]));*/}
        {/*                    } else {*/}
        {/*                    dispatch(setAmenityFilters([...amenityFilters, amenity]));*/}
        {/*                    }*/}
        {/*                  }}*/}
        {/*                >*/}
        {/*                  {amenity}*/}
        {/*                </Checkbox>*/}
        {/*              )),*/}
        {/*          };*/}
        {/*        })*/}
        {/*        .filter((value: any) => value.children.length > 0)}*/}
        {/*    />*/}
        {/*  </div>*/}
        {/*)}*/}
        {/*{typeFilter === "Home" && (*/}
        {/*  <div className={""}>*/}
        {/*    <Title level={5}>Home Amenities</Title>*/}
        {/*    <Collapse*/}
        {/*      ghost*/}
        {/*      items={homeFacilities*/}
        {/*        .map((value: any, index) => {*/}
        {/*          let name: string = Object.keys(value)[0];*/}
        {/*          return {*/}
        {/*            key: index,*/}
        {/*            label: value.name ? value.name : name,*/}
        {/*            children: value.features*/}
        {/*              .filter((value: string) =>*/}
        {/*                availableFilters.amenities.includes(value)*/}
        {/*              )*/}
        {/*              .map((amenity: string, index: number) => (*/}
        {/*                <Checkbox*/}
        {/*                  key={index}*/}
        {/*                  className={"flex"}*/}
        {/*                  checked={amenityFilters.includes(amenity)}*/}
        {/*                  onChange={(e) => {*/}
        {/*                    if (e.target.checked) {*/}
        {/*                     dispatch(setAmenityFilters([...amenityFilters, amenity]));*/}
        {/*                    } else {*/}
        {/*                      dispatch(setAmenityFilters(*/}
        {/*                          amenityFilters.filter((a) => a !== amenity)*/}
        {/*                      ));*/}
        {/*                    }*/}
        {/*                  }}*/}
        {/*                >*/}
        {/*                  {amenity}*/}
        {/*                </Checkbox>*/}
        {/*              )),*/}
        {/*          };*/}
        {/*        })*/}
        {/*        .filter((value: any) => value.children.length > 0)}*/}
        {/*    />*/}
        {/*  </div>*/}
        {/*)}*/}
      </Card>
    </div>
  );
}
