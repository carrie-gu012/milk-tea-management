package com.milktea.backend.controller;

import com.milktea.backend.dto.CreateProductRequest;
import com.milktea.backend.dto.ProductDetailDto;
import com.milktea.backend.model.Product;
import com.milktea.backend.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // 1) GET /products
    @GetMapping
    public List<Product> list() {
        return productService.getAllProducts();
    }

    // 2) GET /products/{id}  (返回 product + recipe)
    @GetMapping("/{id}")
    public ProductDetailDto detail(@PathVariable int id) {
        // 你需要在 ProductService 里实现这个方法
        return productService.getProductDetail(id);
    }

    // 3) POST /products (创建 product，并写入 recipe)
    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody CreateProductRequest req) {
        // 你需要在 ProductService 里实现这个方法
        int newId = productService.createProduct(req);

        return ResponseEntity.ok(Map.of(
                "productId", newId,
                "message", "Product created"
        ));
    }

    // 4) DELETE /products/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable int id) {
        // 你需要在 ProductService 里实现这个方法
        productService.deleteProduct(id);

        return ResponseEntity.ok(Map.of(
                "productId", id,
                "message", "Product deleted"
        ));
    }
}
