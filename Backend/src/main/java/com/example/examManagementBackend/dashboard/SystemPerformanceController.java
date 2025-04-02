package com.example.examManagementBackend.dashboard;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.lang.management.*;
import java.nio.file.FileStore;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/api/v1/system-performance")
public class SystemPerformanceController {

    private final JdbcTemplate jdbcTemplate;

    public SystemPerformanceController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping
    public Map<String, Object> getSystemPerformance() {
        Map<String, Object> performanceData = new HashMap<>();

        performanceData.put("serverUptime", getServerUptime());
        performanceData.put("databaseLoad", getDatabaseLoad());
        performanceData.put("apiResponseTime", getAPIResponseTime());
        performanceData.put("diskUsage", getDiskUsage());
        performanceData.put("cpuUsage", getCPUUsage());
        performanceData.put("memoryUsage", getMemoryUsage());
        performanceData.put("threadCount", getThreadCount());
        performanceData.put("networkLatency", getNetworkLatency());

        return performanceData;
    }

    private String getServerUptime() {
        long uptime = ManagementFactory.getRuntimeMXBean().getUptime();
        return String.format("%.2f hours", uptime / 3600000.0);
    }

    private String getDatabaseLoad() {
        try {
            // For MySQL
            int activeConnections = jdbcTemplate.queryForObject(
                    "SHOW STATUS WHERE Variable_name = 'Threads_connected'",
                    (rs, rowNum) -> rs.getInt("Value")
            );

            int maxConnections = jdbcTemplate.queryForObject(
                    "SHOW VARIABLES WHERE Variable_name = 'max_connections'",
                    (rs, rowNum) -> rs.getInt("Value")
            );

            double loadPercentage = (activeConnections * 100.0) / maxConnections;
            return String.format("%.1f%%", loadPercentage);
        } catch (Exception e) {
            return "N/A";
        }
    }

    private String getAPIResponseTime() {
        long startTime = System.nanoTime();
        // Simulate an API call (replace with actual API execution)
        long responseTime = System.nanoTime() - startTime;
        return responseTime / 1_000_000 + " ms";
    }

    private String getDiskUsage() {
        try {
            Path root = FileSystems.getDefault().getRootDirectories().iterator().next();
            FileStore store = Files.getFileStore(root);
            long total = store.getTotalSpace();
            long used = total - store.getUsableSpace();
            return String.format("%.1f%%", (used * 100.0) / total);
        } catch (Exception e) {
            return "N/A";
        }
    }
    private String getCPUUsage() {
        OperatingSystemMXBean osBean = ManagementFactory.getOperatingSystemMXBean();
        double load = osBean.getSystemLoadAverage(); // Get system CPU load
        return load >= 0 ? String.format("%.1f%%", load * 100) : "N/A";
    }

    private String getMemoryUsage() {
        MemoryMXBean memoryBean = ManagementFactory.getMemoryMXBean();
        MemoryUsage heapUsage = memoryBean.getHeapMemoryUsage();
        long usedMemory = heapUsage.getUsed();
        long maxMemory = heapUsage.getMax();
        return maxMemory > 0 ? String.format("%.1f%%", (usedMemory * 100.0) / maxMemory) : "N/A";
    }

    private int getThreadCount() {
        ThreadMXBean threadBean = ManagementFactory.getThreadMXBean();
        return threadBean.getThreadCount();
    }

    private String getNetworkLatency() {
        // Simulate network latency (replace with real network ping test if needed)
        Random random = new Random();
        return random.nextInt(50) + " ms"; // Simulating 0-50ms network delay
    }
}
