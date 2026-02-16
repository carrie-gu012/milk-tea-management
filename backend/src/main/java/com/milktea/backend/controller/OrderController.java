package com.milktea.backend.controller;

import com.milktea.backend.service.OrderService;
import com.milktea.backend.dto.OrderDetailResponse; 
import com.milktea.backend.model.Order;  

import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;

@RestController
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // ✅ POST /orders
    @PostMapping("/orders")
    public Map<String, Object> createOrder() {
        int id = orderService.createOrder();
        return Map.of("orderId", id, "status", "CREATED");
    }

    // ✅ POST /orders/{id}/items
    @PostMapping("/orders/{orderId}/items")
    public Map<String, Object> addItem(@PathVariable int orderId, @RequestBody AddItemRequest req) {
        orderService.addOrderItem(orderId, req.getProductId(), req.getQuantity());
        return Map.of("ok", true);
    }

    // ✅ POST /orders/{id}/complete
    @PostMapping("/orders/{orderId}/complete")
    public Map<String, Object> complete(@PathVariable int orderId) {
        orderService.completeOrder(orderId);
        return Map.of("orderId", orderId, "status", "COMPLETED");
    }

    // ✅ 新增：GET /orders/{id}
    @GetMapping("/orders/{orderId}")
    public OrderDetailResponse getOrder(@PathVariable int orderId) {
        return orderService.getOrderDetail(orderId);
    }

    public static class AddItemRequest {
        private Integer productId;
        private Integer quantity;

        public AddItemRequest() {}

        public Integer getProductId() { return productId; }
        public void setProductId(Integer productId) { this.productId = productId; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }

    @GetMapping("/orders")
    public List<Order> listOrders(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) Integer offset
    ) {
        return orderService.listOrders(status, limit, offset);
    }
}
