import React, { useEffect, useState } from "react";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { CategoryService, MovieService } from "../../../services";
import { Await, Link } from "react-router-dom";
import { formatDateYYYYMMDD } from "../../../utils";

const EditMovie = (props) => {
  const [formData, setFormData] = useState({
    name: props.movie.name,
    duration: props.movie.duration,
    description: props.movie.description,
    trailer: props.movie.trailer,
    releaseDate: formatDateYYYYMMDD(props.movie.releaseDate),
    categories: props.movie.categories,
    languages: props.movie.languages,
    poster: props.movie.poster,
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    duration: "",
    trailer: "",
    poster: "",
  });


  const [categoriesSelect, setCategoriesSelect] = useState(props.movie?.categories);
  const [categories, setCategories] = useState([]);
  const [languages, setLanguages] = useState(props.movie?.languages);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await CategoryService.GetAllCategories();
        setCategories(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const isValidURL = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  useEffect(() => {
    setFormErrors({
      name: formData.name ? "" : "Vui lòng nhập tên phim",
      duration: formData.duration > 45 ? "" : "Vui lòng nhập thời lượng phim",
      trailer: isValidURL(formData.trailer)
        ? ""
        : "Vui lòng nhập link trailer hợp lệ",
      poster: isValidURL(formData.poster)
        ? ""
        : "Vui lòng nhập link poster hợp lệ",
    });
    console.log(formData);
  }, [formData]);

  const handleUpdateMovie = async () => {
    setFormData({
      name: formData.name,
      duration: formData.duration,
      description: formData.description,
      trailer: formData.trailer,
      releaseDate: formData.releaseDate,
      poster: formData.poster,
      categories: categoriesSelect,
      languages: languages,
    });
    if (
      formErrors.name ||
      formErrors.duration ||
      formErrors.trailer ||
      formErrors.poster
    ) {
      return;
    }
    try {
      const response = await MovieService.UpdateMovie(props.movie.id, formData);
      alert(response.message);
      if (response.status === 200) {
        props.updateMovieDisplay(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //   useEffect(() => {
  //     console.log(categoriesSelect);
  //   }, [categoriesSelect]);

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      console.log(e.target.value);
      const category = { name: e.target.value };
      try {
        const response = await CategoryService.InsertCategory(category);
        console.log(response);
        if (response.status === 200) {
          setCategories([...categories, { name: category.name }]);
          setCategoriesSelect([...categoriesSelect, category]);
          e.target.value = "";
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <div
      ref={props?.objectRef}
      className="h-5/6 overflow-y-auto rounded-lg w-1/2 border border-solid border-gray-500 bg-white shadow-lg p-5"
    >
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Thêm mới phim
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Thêm mới phim vào hệ thống
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="first-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Tên phim
              </label>
              <div className="mt-2">
                <input
                  id="first-name"
                  name="first-name"
                  type="text"
                  autoComplete="given-name"
                  placeholder="Tên phim"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                <span className="text-sm text-red-500">{formErrors.name}</span>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="last-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Thời lượng
              </label>
              <div className="mt-2">
                <input
                  id="last-name"
                  name="last-name"
                  type="number"
                  autoComplete="family-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                />
                <span className="text-sm text-red-500">
                  {formErrors.duration}
                </span>
              </div>
            </div>
            <div className="sm:col-span-3">
              <label
                htmlFor="first-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Poster
              </label>
              <div className="mt-2">
                <input
                  id="first-name"
                  name="first-name"
                  type="text"
                  placeholder="Link hoặc liên kết ảnh"
                  autoComplete="given-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
                  value={formData.poster}
                  onChange={(e) =>
                    setFormData({ ...formData, poster: e.target.value })
                  }
                />
                <span className="text-sm text-red-500">
                  {formErrors.poster}
                </span>
                {formData.poster && (
                  <a
                    className="text-sm underline hover:text-rose-500 text-gray-500"
                    href={formData.poster}
                    target="_blank"
                  >
                    Nhấn để xem trước
                  </a>
                )}
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="first-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Trailer
              </label>
              <div className="mt-2">
                <input
                  id="first-name"
                  name="first-name"
                  type="text"
                  placeholder="Link hoặc liên kết ảnh"
                  autoComplete="given-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
                  value={formData.trailer}
                  onChange={(e) =>
                    setFormData({ ...formData, trailer: e.target.value })
                  }
                />
                <span className="text-sm text-red-500">
                  {formErrors.trailer}
                </span>
                {formData.trailer && (
                  <a
                    className="text-sm underline hover:text-rose-500 text-gray-500"
                    href={formData.trailer}
                    target="_blank"
                  >
                    Nhấn để xem trước trailer
                  </a>
                )}
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="release-date"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Khởi chiếu
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="date"
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
                  value={formData.releaseDate}
                  onChange={(e) =>
                    setFormData({ ...formData, releaseDate: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="col-span-full">
              <label
                htmlFor="release-date"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Thể loại
              </label>
              <div className="mt-2 w-1/3">
                <input
                  id="category"
                  name="category"
                  type="text"
                  placeholder="Thêm thể loại mới"
                  autoComplete="category"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
                  onKeyDown={(e) => handleKeyDown(e)}
                />
              </div>
              <div className="mt-2 grid grid-cols-4 gap-3">
                {categories.map((category) => (
                  <div key={category?.id} className="space-y-2">
                    <label
                      htmlFor="Option3"
                      className="flex cursor-pointer items-start gap-4"
                    >
                      <div className="flex items-center">
                        &#8203;
                        <input
                          type="checkbox"
                          className="size-4 rounded border-gray-300"
                          id="Option3"
                          value={category.name}
                          checked={categoriesSelect.includes(category.name)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCategoriesSelect([
                                ...categoriesSelect,
                                category.name,
                              ]);
                            } else {
                              setCategoriesSelect(
                                categoriesSelect.filter(
                                  (item) => item !== category.name
                                )
                              );
                            }
                          }}
                        />
                      </div>

                      <div>
                        <strong className="font-medium text-gray-900">
                          {category.name}
                        </strong>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="release-date"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Ngôn ngữ
              </label>
              <div className="mt-2 w-1/3">
                <input
                  id="category"
                  name="category"
                  type="text"
                  placeholder="Thêm thể loại mới"
                  autoComplete="category"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setLanguages([...languages, e.target.value]);
                      e.target.value = "";
                    }
                  }}
                />
              </div>
              <div className="mt-2 grid grid-cols-4 gap-3">
                {languages.map((language) => (
                  <div key={language} className="space-y-2">
                    <label
                      htmlFor="Option3"
                      className="flex cursor-pointer items-start gap-4"
                    >
                      <div className="flex items-center">
                        &#8203;
                        <input
                          type="checkbox"
                          className="size-4 rounded border-gray-300"
                          id="Option3"
                          value={language}
                          checked
                        />
                      </div>

                      <div>
                        <strong className="font-medium text-gray-900">
                          {language}
                        </strong>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-full">
              <label
                className="block text-sm font-medium leading-6 text-gray-900"
                htmlFor="description"
              >
                Mô tả
              </label>
              <div className="mt-2">
                <textarea
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
                  rows="8"
                  id="message"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                ></textarea>
                <span className="text-sm text-red-500">
                  {formErrors.description}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          Hủy
        </button>
        <button
          onClick={handleUpdateMovie}
          type="submit"
          className="rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
        >
          Lưu phim
        </button>
      </div>
    </div>
  );
};

export default EditMovie;
