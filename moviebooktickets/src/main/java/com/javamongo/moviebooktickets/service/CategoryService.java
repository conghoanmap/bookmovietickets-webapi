package com.javamongo.moviebooktickets.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.javamongo.moviebooktickets.dto.MyResponse;
import com.javamongo.moviebooktickets.entity.Category;
import com.javamongo.moviebooktickets.repository.CategoryRepository;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Transactional
    public MyResponse<List<Category>> getAllCategories() {
        MyResponse<List<Category>> myResponse = new MyResponse<>();
        myResponse.setStatus(200);
        myResponse.setMessage("Lấy danh sách thành công");
        myResponse.setData(categoryRepository.findAll());
        return myResponse;
    }

    public MyResponse<Category> addCategory(Category category) {
        MyResponse<Category> myResponse = new MyResponse<>();

        Optional<Category> existingCategory = categoryRepository.findByName(category.getName());
        if (existingCategory.isPresent()) {
            myResponse.setStatus(400);
            myResponse.setMessage("Danh mục đã tồn tại");
            myResponse.setData(existingCategory.get());
            return myResponse;
        }
        myResponse.setStatus(200);
        myResponse.setMessage("Thêm danh mục thành công");
        myResponse.setData(categoryRepository.save(category));
        return myResponse;
    }

}
