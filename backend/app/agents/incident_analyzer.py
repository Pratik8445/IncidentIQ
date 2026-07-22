from collections import Counter

from app.models.log_model import Log


class IncidentAnalyzer:

    def analyze(self, logs: list[Log]) -> dict:

        if not logs:
            return {
                "severity": "LOW",
                "total_logs": 0,
                "error_logs": 0,
                "critical_logs": 0,
                "top_failing_service": "N/A",
                "top_failing_host": "N/A",
                "top_environment": "N/A",
                "most_common_error": "No Errors",
                "summary": "No logs available.",
                "possible_root_cause": "No incident detected.",
                "recommendation": "No action required.",
            }

        service_counter = Counter()
        host_counter = Counter()
        environment_counter = Counter()
        message_counter = Counter()

        error_count = 0
        critical_count = 0

        for log in logs:

            service_counter[log.service_name] += 1
            host_counter[log.host] += 1
            environment_counter[log.environment] += 1

            if log.level == "ERROR":
                error_count += 1
                message_counter[log.message] += 1

            elif log.level == "CRITICAL":
                critical_count += 1
                message_counter[log.message] += 1

        top_service = (
            service_counter.most_common(1)[0][0]
            if service_counter
            else "N/A"
        )

        top_host = (
            host_counter.most_common(1)[0][0]
            if host_counter
            else "N/A"
        )

        top_environment = (
            environment_counter.most_common(1)[0][0]
            if environment_counter
            else "N/A"
        )

        most_common_error = (
            message_counter.most_common(1)[0][0]
            if message_counter
            else "No Errors"
        )

        if critical_count > 0:
            severity = "CRITICAL"
        elif error_count >= 5:
            severity = "HIGH"
        elif error_count >= 2:
            severity = "MEDIUM"
        else:
            severity = "LOW"

        return {
            "severity": severity,
            "total_logs": len(logs),
            "error_logs": error_count,
            "critical_logs": critical_count,
            "top_failing_service": top_service,
            "top_failing_host": top_host,
            "top_environment": top_environment,
            "most_common_error": most_common_error,
            "summary": f"Analyzed {len(logs)} log(s).",
            "possible_root_cause": "Rule-based analysis completed.",
            "recommendation": (
                "Investigate the most frequently failing service and host."
            ),
        }


incident_analyzer = IncidentAnalyzer()