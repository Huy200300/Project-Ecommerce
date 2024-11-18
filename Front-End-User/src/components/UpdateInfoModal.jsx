import React, { useState, useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';
import useAddressSelection from '../helpers/useAddressSelection';



const UpdateInfoModal = ({ data, handleOnChange, handleUpdateInfo, setIsOpenModalUpdateInfo }) => {
    const {
        selectedCity,
        setSelectedCity,
        selectedDistrict,
        setSelectedDistrict,
        selectedWard,
        setSelectedWard,
        selectedTab,
        setSelectedTab,
        cities,
        districtsByCity,
        wardsByDistrict
    } = useAddressSelection();
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const isFirstRun = useRef(true);

    useEffect(() => {
        if (isFirstRun.current) {
            if (data?.fullAddress) {
                const parts = data.fullAddress.split(' ');
                const city = parts.slice(0, 2).join(' ');
                const district = parts.slice(2, 4).join(' ');
                const ward = parts.slice(4).join(' ');

                setSelectedCity(city);
                setSelectedDistrict(district);
                setSelectedWard(ward);
            }
            isFirstRun.current = false;
        }
    }, [data, setSelectedCity, setSelectedDistrict, setSelectedWard]);


    useEffect(() => {
        handleOnChange({ target: { name: 'fullAddress', value: `${selectedCity} ${selectedDistrict} ${selectedWard}` } });
    }, [selectedCity, selectedDistrict, selectedWard, handleOnChange]);

    const handleCitySelect = (city) => {
        setSelectedCity(city);
        setSelectedDistrict('');
        setSelectedWard('');
        setSelectedTab('district');
    };

    const handleDistrictSelect = (district) => {
        setSelectedDistrict(district);
        setSelectedWard('');
        setSelectedTab('ward');
    };

    const handleWardSelect = (ward) => {
        setSelectedWard(ward);
        setDropdownVisible(false);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        handleUpdateInfo(e);
    };

    return (
        <div className="fixed inset-0 top-0 z-50 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white p-6 rounded-md w-full max-w-2xl font-semibold h-5/6 flex flex-col justify-between">
                <div className="flex mb-6 justify-between items-center">
                    <h2 className="text-xl capitalize">Địa chỉ mới</h2>
                    <button onClick={() => setIsOpenModalUpdateInfo(false)}>
                        <FaTimes className="text-red-500" />
                    </button>
                </div>
                <form onSubmit={handleFormSubmit} className="flex-grow isolate">
                    <div className='relative h-full flex flex-col'>
                        <div className='h-[90%] overflow-auto hide-scrollbar'>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-700 mb-1">Họ và tên</label>
                                    <input
                                        type="text"
                                        name='fullName'
                                        value={data?.fullName}
                                        onChange={handleOnChange}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-1">Số điện thoại</label>
                                    <input
                                        type="text"
                                        name='phone'
                                        value={data?.phone}
                                        onChange={handleOnChange}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mb-4 relative">
                                <label className="block text-gray-700 mb-1">Tỉnh/Thành phố, Quận/Huyện, Phường/Xã</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name='fullAddress'
                                        value={`${selectedCity} ${selectedDistrict} ${selectedWard}`}
                                        readOnly
                                        onClick={() => setDropdownVisible(!dropdownVisible)}
                                        className="w-full p-2 border rounded cursor-pointer"
                                        required
                                    />
                                </div>
                                {dropdownVisible && (
                                    <div className="absolute z-10 bg-white border w-full mt-2 rounded-md">
                                        <div className="flex">
                                            <button
                                                type="button"
                                                className={`w-1/3 p-2 border-b-2 text-center ${selectedTab === 'city' ? 'text-red-500 border-red-500' : ''}`}
                                                onClick={() => setSelectedTab('city')}
                                            >
                                                Tỉnh/Thành phố
                                            </button>
                                            <button
                                                type="button"
                                                className={`w-1/3 p-2 border-b-2 text-center ${selectedTab === 'district' ? 'text-red-500 border-red-500' : ''}`}
                                                onClick={() => setSelectedTab('district')}
                                                disabled={!selectedCity}
                                            >
                                                Quận/Huyện
                                            </button>
                                            <button
                                                type="button"
                                                className={`w-1/3 p-2 border-b-2 text-center ${selectedTab === 'ward' ? 'text-red-500 border-red-500' : ''}`}
                                                onClick={() => setSelectedTab('ward')}
                                                disabled={!selectedDistrict}
                                            >
                                                Phường/Xã
                                            </button>
                                        </div>
                                        <div className="max-h-48 overflow-y-auto">
                                            {selectedTab === 'city' && cities.map(city => (
                                                <div key={city} className="p-2 cursor-pointer hover:bg-gray-100" onClick={() => handleCitySelect(city)}>
                                                    {city}
                                                </div>
                                            ))}
                                            {selectedTab === 'district' && districtsByCity[selectedCity]?.map(district => (
                                                <div key={district} className="p-2 cursor-pointer hover:bg-gray-100" onClick={() => handleDistrictSelect(district)}>
                                                    {district}
                                                </div>
                                            ))}
                                            {selectedTab === 'ward' && wardsByDistrict[selectedDistrict]?.map(ward => (
                                                <div key={ward} className="p-2 cursor-pointer hover:bg-gray-100" onClick={() => handleWardSelect(ward)}>
                                                    {ward}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-1">Địa chỉ cụ thể</label>
                                <input
                                    type="text"
                                    name='detailAddress'
                                    value={data?.detailAddress}
                                    onChange={handleOnChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <button
                                    type="button"
                                    className="w-full py-2 text-blue-500 border border-blue-500 rounded hover:bg-blue-100"
                                >
                                    + Thêm vị trí
                                </button>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-1">Giao Tới:</label>
                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        className={`py-2 px-4 border rounded ${data?.addressType === 'Nhà Riêng' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border-blue-500'}`}
                                        onClick={() => handleOnChange({ target: { name: 'addressType', value: 'Nhà Riêng' } })}
                                    >
                                        Nhà Riêng
                                    </button>
                                    <button
                                        type="button"
                                        className={`py-2 px-4 border rounded ${data?.addressType === 'Văn Phòng' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border-blue-500'}`}
                                        onClick={() => handleOnChange({ target: { name: 'addressType', value: 'Văn Phòng' } })}
                                    >
                                        Văn Phòng
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-start items-center">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name='defaultAddress'
                                        checked={data?.defaultAddress}
                                        onChange={handleOnChange}
                                        className="mr-2"
                                    />
                                    Đặt làm địa chỉ mặc định
                                </label>
                            </div>
                        </div>
                        <div className='bg-new absolute bottom-0 left-0 right-0 flex justify-end items-center p-1.5'>
                            <div className="space-x-2 bg-new">
                                <button
                                    type="button"
                                    onClick={() => setIsOpenModalUpdateInfo(false)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                                >
                                    Trở Lại
                                </button>
                                <button
                                    type="submit"
                                    className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-700"
                                >
                                    Hoàn thành
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateInfoModal;
