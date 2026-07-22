from typing import Dict


class RuleEngine:

    def analyze(self, log_message: str) -> Dict:

        log = log_message.lower()

        rules = [
            {
                "keywords": ["database", "sql", "postgres", "mysql"],
                "category": "DATABASE",
                "severity": "HIGH",
                "root_cause": "Database connectivity issue",
                "suggestion": "Check database service and connection pool."
            },
            {
                "keywords": ["timeout", "timed out"],
                "category": "NETWORK",
                "severity": "HIGH",
                "root_cause": "Network timeout",
                "suggestion": "Check network latency and downstream services."
            },
            {
                "keywords": ["memory", "out of memory"],
                "category": "MEMORY",
                "severity": "HIGH",
                "root_cause": "Memory exhaustion",
                "suggestion": "Check memory usage and restart affected service if required."
            },
            {
                "keywords": ["cpu"],
                "category": "CPU",
                "severity": "MEDIUM",
                "root_cause": "High CPU utilization",
                "suggestion": "Investigate running processes and optimize workloads."
            },
            {
                "keywords": ["disk", "storage"],
                "category": "STORAGE",
                "severity": "HIGH",
                "root_cause": "Disk space issue",
                "suggestion": "Free disk space or expand storage."
            },
            {
                "keywords": ["unauthorized", "authentication"],
                "category": "AUTH",
                "severity": "HIGH",
                "root_cause": "Authentication failure",
                "suggestion": "Verify credentials or authentication service."
            },
            {
                "keywords": ["forbidden"],
                "category": "AUTH",
                "severity": "MEDIUM",
                "root_cause": "Authorization failure",
                "suggestion": "Verify user roles and permissions."
            },
            {
                "keywords": ["error"],
                "category": "APPLICATION",
                "severity": "MEDIUM",
                "root_cause": "Application error",
                "suggestion": "Review application logs for more details."
            },
            {
                "keywords": ["warning"],
                "category": "APPLICATION",
                "severity": "LOW",
                "root_cause": "Application warning",
                "suggestion": "Monitor the application and investigate if warnings increase."
            }
        ]

        for rule in rules:
            if any(keyword in log for keyword in rule["keywords"]):
                return {
                    "matched": True,
                    "category": rule["category"],
                    "severity": rule["severity"],
                    "root_cause": rule["root_cause"],
                    "suggestion": rule["suggestion"]
                }

        return {
            "matched": False,
            "category": "UNKNOWN",
            "severity": "LOW",
            "root_cause": "Unknown issue",
            "suggestion": "Forward the log to the AI analyzer."
        }


rule_engine = RuleEngine()