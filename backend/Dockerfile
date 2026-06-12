FROM python:3.11
WORKDIR /app
COPY req.txt .
RUN pip install -r req.txt
COPY . . 
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]