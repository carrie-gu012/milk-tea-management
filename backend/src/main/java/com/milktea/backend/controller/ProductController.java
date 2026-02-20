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
      
        return productService.getProductDetail(id);
    }

    // 3) POST /products (创建 product，并写入 recipe)
    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody CreateProductRequest req) {
     
        int newId = productService.createProduct(req);

        return ResponseEntity.ok(Map.of(
                "productId", newId,
                "message", "Product created"
        ));
    }

    // 4) DELETE /products/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable int id) {

        productService.deleteProduct(id);

        return ResponseEntity.ok(Map.of(
                "productId", id,
                "message", "Product deleted"
        ));
    }
    // 5) PUT /products/{id} (更新 product，并替换 recipe)
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> update(
            @PathVariable int id,
            @RequestBody CreateProductRequest req) {

        productService.updateProduct(id, req);

        return ResponseEntity.ok(Map.of(
                "productId", id,
                "message", "Product updated"
        ));
    }


        

}
