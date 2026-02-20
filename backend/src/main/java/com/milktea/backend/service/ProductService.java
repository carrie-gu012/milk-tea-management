package com.milktea.backend.service;

import com.milktea.backend.dto.CreateProductRequest;
import com.milktea.backend.dto.ProductDetailDto;
import com.milktea.backend.dto.RecipeLine;
import com.milktea.backend.model.Product;
import com.milktea.backend.repository.ProductRepository;
import com.milktea.backend.repository.RecipeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final RecipeRepository recipeRepository;

    public ProductService(ProductRepository productRepository,
                          RecipeRepository recipeRepository) {
        this.productRepository = productRepository;
        this.recipeRepository = recipeRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public ProductDetailDto getProductDetail(int productId) {
        Product p = productRepository.findById(productId);
        List<RecipeLine> recipe = recipeRepository.findRecipeByProductId(productId);

        ProductDetailDto dto = new ProductDetailDto();
        dto.setProductId(p.getProductId());
        dto.setName(p.getName());
        dto.setPriceCents(p.getPriceCents());
        dto.setIsActive(p.getIsActive());
        dto.setRecipe(recipe);

        return dto;
    }

    @Transactional
    public int createProduct(CreateProductRequest req) {
        // 基础校验（避免空数据）
        if (req.getName() == null || req.getName().trim().isEmpty()) {
            throw new RuntimeException("Product name is required");
        }
        if (req.getPriceCents() == null || req.getPriceCents() <= 0) {
            throw new RuntimeException("priceCents must be > 0");
        }
        if (req.getIsActive() == null) {
            req.setIsActive(true);
        }
        if (req.getRecipe() == null || req.getRecipe().isEmpty()) {
            throw new RuntimeException("Recipe is required (at least 1 ingredient)");
        }

        int newId = productRepository.insert(req.getName(), req.getPriceCents(), req.getIsActive());
        recipeRepository.replaceRecipe(newId, req.getRecipe());
        return newId;
    }
    // ================= UPDATE ⭐新增 =================
    @Transactional
    public void updateProduct(int productId, CreateProductRequest req) {

        if (req.getName() == null || req.getName().trim().isEmpty()) {
            throw new RuntimeException("Product name is required");
        }

        if (req.getPriceCents() == null || req.getPriceCents() <= 0) {
            throw new RuntimeException("priceCents must be > 0");
        }

        if (req.getIsActive() == null) {
            req.setIsActive(true);
        }

        // 更新 product 表
        productRepository.update(
                productId,
                req.getName(),
                req.getPriceCents(),
                req.getIsActive()
        );

        // 更新 recipe
        if (req.getRecipe() != null) {
            recipeRepository.replaceRecipe(productId, req.getRecipe());
        }
    }


    public void deleteProduct(int productId) {
        int affected = productRepository.deleteById(productId);
        if (affected == 0) {
            throw new RuntimeException("Product not found: " + productId);
        }
    }
}
