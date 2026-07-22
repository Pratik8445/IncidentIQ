from groq import Groq

from app.core.config import settings


class GroqService:

    def __init__(self):

        self.client = Groq(
            api_key=settings.GROQ_API_KEY
        )

        self.model = settings.GROQ_MODEL

    def generate_incident_report(
        self,
        analysis: dict,
    ) -> str:

        prompt = f"""
You are an experienced Site Reliability Engineer.

Analyze the following incident.

Severity:
{analysis["severity"]}

Total Logs:
{analysis["total_logs"]}

Error Logs:
{analysis["error_logs"]}

Critical Logs:
{analysis["critical_logs"]}

Top Failing Service:
{analysis["top_failing_service"]}

Top Host:
{analysis["top_failing_host"]}

Most Common Error:
{analysis["most_common_error"]}

Generate a professional incident report with:

1. Executive Summary
2. Probable Root Cause
3. Business Impact
4. Recommended Actions
5. Prevention Strategy

Return plain text.
"""

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert SRE.",
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            temperature=0.2,
        )

        return response.choices[0].message.content


groq_service = GroqService()