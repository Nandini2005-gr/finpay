from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from auth import get_current_user
import models, schemas

router = APIRouter(prefix="/transactions", tags=["Transactions"])

@router.post("/", response_model=schemas.TransactionOut)
def create_transaction(
    transaction: schemas.TransactionCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Update balance
    if transaction.type == "debit":
        if current_user.balance < transaction.amount:
            raise HTTPException(status_code=400, detail="Insufficient balance")
        current_user.balance -= transaction.amount
    else:
        current_user.balance += transaction.amount

    new_transaction = models.Transaction(
        title=transaction.title,
        amount=transaction.amount,
        category=transaction.category,
        type=transaction.type,
        user_id=current_user.id
    )
    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)
    return new_transaction


@router.get("/", response_model=list[schemas.TransactionOut])
def get_transactions(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return db.query(models.Transaction)\
             .filter(models.Transaction.user_id == current_user.id)\
             .order_by(models.Transaction.created_at.desc())\
             .all()


@router.get("/summary")
def get_summary(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    transactions = db.query(models.Transaction)\
                     .filter(models.Transaction.user_id == current_user.id)\
                     .all()

    total_credit = sum(t.amount for t in transactions if t.type == "credit")
    total_debit = sum(t.amount for t in transactions if t.type == "debit")

    # Spending by category
    categories = {}
    for t in transactions:
        if t.type == "debit":
            categories[t.category] = categories.get(t.category, 0) + t.amount

    return {
        "balance": current_user.balance,
        "total_income": total_credit,
        "total_expenses": total_debit,
        "spending_by_category": categories
    }