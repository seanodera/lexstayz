"use client";
import HomeItem from "@/components/Grid Items/HomeItem";
import HotelItem from "@/components/Grid Items/HotelItem";
import SearchFilter from "@/components/search/searchFilter";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {Home, Hotel, Stay} from "@/lib/types";
import {selectConfirmBooking, updateBookingData,} from "@/slices/confirmBookingSlice";
import {
    fetchFilteredStays,
    fetchLocationSuggestions,
    searchAsync,
    selectPreFilteredList,
    selectSearchResults,
    setDisplayList,
    setLocationFilter,
    updatePreFilter,
} from "@/slices/searchSlice";
import {selectAllStays} from "@/slices/staysSlice";
import {FilterOutlined, MinusOutlined, PlusOutlined, SearchOutlined,} from "@ant-design/icons";
import {Affix, AutoComplete, Button, DatePicker, Drawer} from "antd";
import {isWithinInterval, parseISO} from "date-fns";
import dayjs from "dayjs";
import debounce from "lodash/debounce";
import {useSearchParams} from "next/navigation";
import {useEffect, useMemo, useRef, useState} from "react";
import {useMediaQuery} from "react-responsive";

const { RangePicker } = DatePicker;
export default function SearchComponent() {
  const dispatch = useAppDispatch();

  const allStays = useAppSelector(selectAllStays);
  const stays = useAppSelector(selectSearchResults);
  const preFilter = useAppSelector(selectPreFilteredList);
  const { locationSuggestions, displayList } = useAppSelector((state) => state.search);
  const [open, setOpen] = useState(false);
  const params = useSearchParams();
  const booking = useAppSelector(selectConfirmBooking);
  const [startDate, setStartDate] = useState(booking.checkInDate);
  const [endDate, setEndDate] = useState(booking.checkOutDate);
  const [numGuests, setNumGuests] = useState(booking.numGuests);
  const isMobile = useMediaQuery({ maxWidth: 640 });
  const [selectedLabel, setSelectedLabel] = useState<string>("");
  const rangePickerRef = useRef<any>(null);


  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const handleFilterUpdate = (staysArray: Stay[]) => {
      const filteredStays = filterStaysByDate(staysArray);
      dispatch(setDisplayList(filteredStays));
      dispatch(updatePreFilter(filteredStays));
    };

    if (preFilter.length > 0) {
      handleFilterUpdate(preFilter);
    } else if (stays.length > 0) {
      handleFilterUpdate(stays);
    } else {
      handleFilterUpdate(allStays);
    }
  }, []);

  useEffect(() => {
    if (params.has("loc")) {
      const location = params.get("loc") || "";
      if (location) {
        setSelectedLabel(location);

        dispatch(searchAsync(location));
      }
    }
  }, [params, dispatch]);

  const debouncedHandleSearch = useMemo(
    () =>
      debounce((value: string) => {
        if (!value) return;
        dispatch(fetchLocationSuggestions(value));
      }, 300),
    [dispatch]
  );

  const handleSelect = (value: string, option: any) => {
    setSelectedLabel(option.label);
    if (rangePickerRef.current) {
      rangePickerRef.current.focus();
    }
    dispatch(setLocationFilter(JSON.parse(value)))
  };


  useEffect(() => {
    if (stays.length > 0) {
      let data = filterStaysByDate(stays);
      dispatch(setDisplayList(data));
      dispatch(updatePreFilter(data));
    }
  }, [stays, startDate, endDate, dispatch]);

  useEffect(() => {
    return () => {
      debouncedHandleSearch.cancel();
    };
  }, [debouncedHandleSearch]);

  function filterStaysByDate(stays: Stay[]) {
    return [...stays].filter((stay) => {
      const bookedDates = stay.bookedDates
      if (!bookedDates) return true; // If no booked dates, it's available

      return !bookedDates.some((date: string) =>
        isWithinInterval(parseISO(date), { start: startDate, end: endDate })
      );
    });
  }

  useEffect(() => {
    dispatch(
      updateBookingData({
        numGuests: numGuests,
        checkInDate: startDate,
        checkOutDate: endDate,
      })
    );
  }, [numGuests, startDate, endDate, dispatch]);

  return (
    <div className={"bg-white"}>
      <Affix offsetTop={0} className={"z-30"}>
        <div
          className={
            "flex justify-between gap-2 sticky-top z-50 bg-white py-3 px-7 border-solid border-gray-100 border-0 border-t border-b"
          }
        >
          <div></div>
          <div className={"flex max-md:flex-col gap-2 "}>
            <AutoComplete
              className={"bg-gray-200 rounded-lg max-md:w-full min-w-52 items-center py-0 my-0"}
              size="large"
              placeholder="Anywhere"
              onSearch={debouncedHandleSearch}
              options={locationSuggestions}
              variant="borderless"
              value={selectedLabel}
              onSelect={handleSelect}
              onChange={(value) => setSelectedLabel(value)}
            />
            <RangePicker
            ref={rangePickerRef}
              panelRender={(panelNode) => (
                <div className={`flex ${isMobile ? "flex-col" : "flex-row"}`}>
                  {panelNode}
                </div>
              )}
              value={[dayjs(booking.checkInDate), dayjs(booking.checkOutDate)]}
              onChange={(value) => {
                if (value) {
                  setStartDate(dayjs(value[0]).toString());
                  setEndDate(dayjs(value[1]).toString());
                }
              }}
              className="bg-gray-200 rounded-lg border-0 "
              format="DD MMMM"
              disabledDate={(current) =>
                current.isBefore(dayjs().subtract(1, "day"))
              }
              placeholder={["Check-in", "Check-out"]}
              popupClassName=""
            />
            <div
              className={
                "bg-gray-200 rounded-lg border-0 flex items-center w-max px-2 gap-2"
              }
            >
              <Button
                icon={<MinusOutlined />}
                onClick={() =>
                  setNumGuests((prev) => (prev > 1 ? prev - 1 : prev))
                }
              />
              {numGuests} Guests
              <Button
                onClick={() => setNumGuests((prev) => prev + 1)}
                icon={<PlusOutlined />}
              />
            </div>
            <Button
              onClick={() => {
                dispatch(fetchFilteredStays())
              }}
              icon={<SearchOutlined />}
              type={"primary"}
              size="large"
            />
          </div>
          <Button
            className={"bg-gray-200 text-gray-500"}
            onClick={showDrawer}
            size={"large"}
            type={"text"}
            icon={<FilterOutlined />}
          >
            Filter
          </Button>
        </div>
      </Affix>
      <div
        className={
          "px-7 py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        }
      >
        {[...displayList]
          .filter((stay) => stay.published)
          .map((stay: any, index) =>
            stay.type === "Hotel" ? (
              <HotelItem key={index} hotel={stay} />
            ) : (
              <HomeItem stay={stay} key={index} />
            )
          )}
      </div>
      <Drawer
        title="Filter Stays"
        onClose={onClose}
        open={open}
        classNames={{
          body: "p-0",
        }}
      >
        <SearchFilter
          stays={preFilter}
          onFilter={(filteredList: any) => {
            const data = filterStaysByDate(filteredList);
            if (data.length !== 0 && data.length !== displayList.length) {
              console.log(
                "Prefilter: ",
                preFilter,
                " Filtered list: ",
                filteredList,
                "data: ",
                data
              );

            }
          }}
        />
      </Drawer>
    </div>
  );
}
